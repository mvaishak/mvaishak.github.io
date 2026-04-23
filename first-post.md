# Beyond the Algorithm: Building a Multi-Dimensional Taste Engine from Cinematic Craft

  

---

  

## The Problem with Collaborative Filtering

  

Every major film recommendation platform — Letterboxd, Netflix, MUBI — uses some variant of collaborative filtering. The logic is straightforward: find users who rated the same films you did, then surface what they rated highly that you haven't seen. The implicit assumption is that shared rating history implies shared taste.

  

For the median viewer, this works well enough. For someone who has watched 800+ films and can articulate exactly why they gave *The Zone of Interest* five stars while finding *Oppenheimer* intellectually hollow despite both receiving near-identical aggregate scores, collaborative filtering is useless. It models the demographic you belong to, not the craft dimensions you actually respond to.

  

The failure mode is specific: collaborative filtering cannot distinguish between two viewers who both gave *There Will Be Blood* five stars if one did so for Daniel Plainview's performance and the other for Robert Elswit's cinematography and the elliptical editing rhythm. These are completely different taste signals that will produce completely different downstream recommendations — but the algorithm treats them as identical data points.

  

The deeper problem: **taste is latent**. Even the viewer themselves cannot fully articulate it. Ask someone why they consistently rate slow-burn art cinema higher than consensus, and they'll give you a post-hoc rationalisation. The real signal is in the pattern of their ratings against the craft properties of the films — and extracting that signal requires representing the films in craft terms first.

  

This project is an attempt to build that representation layer from scratch.

  

---

  

## The Architecture Decision

  

The system has three distinct jobs:

  

1. **Represent** every film as a vector of craft properties, not genre tags

2. **Model** the user's rating behaviour as a function of those craft properties

3. **Retrieve** unseen films that score well on the dimensions the model identifies as predictive

  

Each of these is a non-trivial engineering problem. The design choices for each are worth examining in detail.

  

---

  

## Annotation Strategy: Why LLM, Why Structured Outputs

  

The obvious alternative to LLM annotation is TMDB genre tags. TMDB gives you tags like "Drama", "Thriller", "Foreign Language Film". These are useless for taste modelling: they describe marketing categories, not craft properties. Knowing that a film is a "Drama" tells you nothing about whether it uses elliptical editing, a slow accumulative pacing structure, or a naturalistic colour palette — the dimensions that actually predict whether a particular viewer will rate it highly.

  

Manual curation of craft annotations at 800+ films is not feasible. The only viable path is LLM annotation with a locked schema.

  

The schema design is the critical decision. The wrong approach is an open-ended prompt: "describe this film's cinematographic style." The output is inconsistent, verbose, and impossible to use as a feature matrix. The right approach is a Pydantic model with `str, Enum` fields:

  

```python

class PacingSignature(str, Enum):

SLOW_BURN = "slow_burn"

MEASURED = "measured"

PROPULSIVE = "propulsive"

FRENETIC = "frenetic"

VARIABLE = "variable"

  

class CraftAnnotation(BaseModel):

pacing_signature: PacingSignature

reality_register: RealityRegister

cinematographic_language: CinematographicLanguage

editor_signature: EditorSignature

# ... 16 more dimensions

```

  

The schema has 20 dimensions, each a closed enum. The LLM is constrained to choose from the defined values — it cannot hallucinate a value that doesn't exist in the vocabulary. This is enforced by [Instructor](https://github.com/jxnl/instructor) in `JSON_SCHEMA` mode, which wraps the LM Studio OpenAI-compatible endpoint and retries on schema violations:

  

```python

client = instructor.from_openai(

OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio"),

mode=instructor.Mode.JSON_SCHEMA,

)

  

annotation = client.chat.completions.create(

model="qwen/qwen3.5-9b",

response_model=CraftAnnotation,

max_retries=3,

messages=[{"role": "user", "content": prompt}],

)

```

  

The result is a typed Python object you can directly serialise to JSON and load back. 808 films annotated across 20 dimensions produces a feature matrix with well-defined semantics at every cell.

  

**Annotation consistency** is the main risk. The same film annotated twice with different prompt orderings should produce the same result. The system mitigates this through two mechanisms: the closed enum vocabulary (the model cannot produce a "novel" description) and per-TMDB-ID caching (each film is annotated exactly once; subsequent runs use the cached result). A consistency audit — annotating 50 films twice and measuring agreement — should be run before trusting the taste model at scale. The target is ≥85% agreement on the eight highest-weight dimensions.

  

**Sparse data for obscure films** is the second risk. The annotation prompt uses TMDB crew data, genres, and runtime as context. For a 1972 Andrei Tarkovsky film, the LLM has strong prior knowledge and produces confident annotations. For a 2019 Bangladeshi art film, the context is thin and the annotation confidence field will be set to 1 (low). The taste model can weight by annotation confidence, and the Langfuse traces flag confidence level per recommendation candidate.

  

---

  

## The Knowledge Graph: NetworkX as a Craft Lineage Index

  

Qdrant handles similarity retrieval — given a query, find films whose craft annotations are semantically close. But semantic similarity has a ceiling: it only surfaces films that look like films you already know. The knowledge graph handles a different problem: surfacing films that share *craft lineage* with films you rate highly, even if they look nothing like them on the surface.

  

The graph is a NetworkX `DiGraph` with six node types and eight edge types:

  

```

Node types: FILM, DIRECTOR, CINEMATOGRAPHER, EDITOR, WRITER, COMPOSER

Edge types: DIRECTED, SHOT, EDITED, WROTE, COMPOSED,

COLLABORATED_WITH, INFLUENCED_BY, THEMATIC_LINK

```

  

The current graph: **3,505 nodes, 10,574 edges**. The density (0.000861) is intentionally low — this is a sparse graph of deliberate relationships, not a similarity web.

  

The `INFLUENCED_BY` edges are the most valuable. These connect directors across periods and traditions: if Chantal Akerman appears as an influence on a director whose films you rate consistently highly, the graph can traverse to Akerman's filmography and surface films you haven't seen. This is a recommendation the genre-based or similarity-based approach would never produce.

  

The retrieval strategy in `graph_retriever.py` is a 3-hop traversal:

  

```python

# Step 1: Top-rated directors from the user's history

top_directors = sorted(director_nodes, key=lambda x: x[1]["avg_user_rating"])[:10]

  

# Step 2: Their unseen direct filmography

for dir_id, dir_data in top_directors:

for film in G.out_edges(dir_id, data=True):

if edge["edge_type"] == EdgeType.DIRECTED.value:

add_candidate(film_id, score=dir_data["avg_user_rating"])

  

# Step 3: INFLUENCED_BY hops (score discounted 10-15% per hop)

for _, target_id, _ in G.out_edges(dir_id, data=True):

if edge["edge_type"] == EdgeType.INFLUENCED_BY.value:

add_candidate(films_by_target, score=dir_score * 0.85)

  

# Step 4: Collaborators of top-5 directors (cinematographers, editors)

for _, collab_id, _ in G.out_edges(dir_id, data=True):

if edge in {COLLABORATED_WITH, SHOT, EDITED}:

add_candidate(films_by_collaborator, score=dir_score * 0.75)

```

  

The score discount at each hop matters: a film two hops away from a highly-rated director's collaborator is a weaker signal than a direct recommendation. The final candidate list is sorted by this graph score before being merged with RAG results.

  

**The interplay with Qdrant:** the LangGraph agent runs both retrieval paths in parallel and merges them before re-ranking. RAG retrieval finds films that are semantically similar to the query and to high-rated seen films. Graph traversal finds films that are craft-adjacent without necessarily being semantically similar. The merge step deduplicates by TMDB ID and keeps the stronger signal where both paths surface the same film. This is where the GraphRAG architecture earns its complexity: neither source alone produces the right candidate set.

  

---

  

## The Taste Decomposition Model

  

The feature matrix is built by one-hot encoding all nominal craft dimensions (`pacing_signature`, `tone_primary`, etc.) and ordinally encoding the few ordered dimensions (`annotation_confidence`). The target variable is the user's rating expressed as divergence from their own mean — not the raw rating. This is important: it removes the overall scale of the user's rating behaviour and focuses the model on what makes a specific film better or worse than average *for this user*.

  

Four models are trained in parallel and compared by cross-validated MAE:

  

```python

MODELS = {

"ridge_weak_signal": Pipeline([

("scaler", StandardScaler()),

("model", Ridge(alpha=0.1)),

]),

"elasticnet": Pipeline([

("scaler", StandardScaler()),

("model", ElasticNet(alpha=0.01, l1_ratio=0.3, max_iter=10000)),

]),

"gradient_boosting": GradientBoostingRegressor(

n_estimators=500, max_depth=2, learning_rate=0.01,

subsample=0.6, min_samples_leaf=10,

),

"random_forest": RandomForestRegressor(

n_estimators=500, max_depth=4, min_samples_leaf=10,

max_features=0.3,

),

}

```

  

The feature selection step runs before model training: `VarianceThreshold(threshold=0.01)` removes near-zero-variance columns, then a correlation filter keeps only features with `|corr(feature, target)| > 0.05`. This reduces the dimensionality from ~140 one-hot columns to the features that actually have signal.

  

Current results on 808 films:

  

| Model | CV R² (mean) | CV R² (std) | MAE |

|---|---|---|---|

| ridge\_weak\_signal | 0.026 | 0.043 | 0.552 |

| elasticnet | 0.034 | 0.043 | 0.549 |

| gradient\_boosting | 0.023 | 0.025 | 0.548 |

| random\_forest | 0.024 | 0.018 | **0.546** |

  

The R² values look discouraging until you understand what they're measuring. The target is divergence from mean, which ranges roughly ±2 stars. A naive predictor (always predicting 0 divergence) would achieve MAE equal to the mean absolute divergence — roughly 0.55-0.65 stars at this rating distribution. The model is achieving 0.546, which means it is slightly better than a naive predictor. The signal is real, but weak.

  

**Why is the signal weak?** Two reasons. First, 808 films with a 0.739 star standard deviation is a small dataset for learning fine-grained craft preferences. More data will help. Second, craft dimensions explain only *part* of what drives a personal film rating — the rest is execution quality within those dimensions, which the annotation schema does not capture. A film can be `slow_burn`, `naturalistic`, `expressionistic` and still be executed badly. The taste model captures the preference for the *type*; it cannot account for how well the type is executed.

  

The divergence profile — where the user's ratings consistently differ from TMDB consensus — is the most actionable output:

  

```

ending_valence = ironic_subverted: -0.77 ★ vs. consensus

production_register = mid_budget_studio: -0.43 ★

reality_register = mythic: -0.38 ★

body_experience = propulsive_momentum: -0.30 ★

pacing_signature = propulsive: -0.28 ★

```

  

This is a precise statement: films with ironic/subverted endings are rated nearly a full star below consensus by this user, while films with `ending_valence = ambiguous_open` or `transcendent` score above consensus. The re-ranking step in the LangGraph agent uses exactly this profile to score candidates before synthesis.

  

---

  

## The LangGraph Agent: State as a First-Class Object

  

The recommendation agent is a compiled LangGraph `StateGraph`. The state is a `TypedDict` that flows through four pure-function nodes:

  

```python

class AgentState(TypedDict):

query: str

seen_ids: list[int]

taste_profile: dict

rag_hits: list[dict]

graph_hits: list[dict]

candidates: list[dict]

recommendations: list[dict]

confidence: str

```

  

Each node takes the state and returns a new state with its contribution merged:

  

```

rag_retrieve → graph_traverse → rerank_by_taste → synthesize → END

```

  

The synthesis node sends the top 10 taste-ranked candidates to the LLM with the user's taste profile as context. The prompt is deliberately structured:

  

```python

prompt = f"""

USER TASTE PROFILE:

Top craft dimensions: {dims}

Rates ABOVE consensus: {likes}

Rates BELOW consensus: {dislikes}

  

CANDIDATE FILMS (pre-ranked by taste alignment):

{candidate_summaries}

  

Select the 3 best. For each, write an explanation that references

at least 2 specific craft dimensions from the taste profile.

"""

```

  

The output is constrained by Instructor to a `SynthesisOutput` Pydantic model with a `list[FilmRecommendation]` field. Each `FilmRecommendation` must include `key_dimensions` and `via_path` — the latter tracing whether the film was surfaced via RAG similarity or graph traversal. This prevents the LLM from producing generic praise; every explanation is grounded in the dimensions the taste model identifies as predictive.

  

---

  

## The Prediction Engine: Honest Evaluation

  

The prediction engine takes a film's `CraftAnnotation` and the user's taste profile and asks the LLM to predict the user's star rating before they watch the film. The prediction is rounded to the nearest 0.5 and stored in SQLite alongside the timestamp and the top taste dimensions used.

  

After the user watches the film and logs the actual rating:

  

```bash

python -m src.evaluation.run_logger log --tmdb-id 11216 --rating 4.0

```

  

The prediction error (MAE contribution) is computed and stored. The accuracy report tracks cumulative MAE over time, within-½★ accuracy, and within-1★ accuracy, broken down by taste model version.

  

This is the only honest evaluation metric for a personalised recommendation system. There is no held-out test set that predates the rating history — the only valid test is whether the system predicts future ratings correctly. The MAE curve over time is the accuracy evidence. If the system is working, MAE should decrease as more predicted films get logged, because the taste model has more signal and the LLM has more context about the user's specific preferences.

  

Current baseline: **MAE 0.546 ★** from the taste model. The prediction engine has a target of ≤ 0.75 ★ MAE over 20+ evaluated films, which would represent a meaningful improvement over the naive mean predictor.

  

---

  

## What the Data Revealed

  

The divergence profile is where the system produces genuinely surprising output.

  

The strongest single predictor of a below-consensus rating is `ending_valence = ironic_subverted` (−0.77 ★). Films with endings that undercut their own emotional journey — where the resolution is deliberately deflating or self-aware — score nearly a full star below what the aggregate audience gives them. The opposite pattern is also true: `ending_valence = ambiguous_open` scores above consensus. The user prefers films that resist resolution over films that perform the gesture of resolution ironically.

  

`production_register = mid_budget_studio` (−0.43 ★) is the second strongest signal. The mid-budget studio film occupies an uncomfortable middle ground: too expensive to be formally adventurous, too genre-inflected to be art cinema. The user rates these below consensus while rating both `micro_budget_independent` films and large-scale productions without penalty. The distrust is specifically of the studio prestige register, not of budget as such.

  

`reality_register = mythic` (−0.38 ★) captures a preference against films that abstract their subject into allegory. The highest-rated films in the history tend to be `naturalistic` or `heightened_stylized` — specific about their world rather than universal about it.

  

The `director_lineage` dimension has the highest ridge weight (+0.1889) of any single feature. This makes sense: the director lineage — whether a film belongs to the European art cinema tradition, the American independent tradition, East Asian contemplative cinema, etc. — is the single strongest predictor of whether a film will match the user's taste. More importantly, it is a feature that collaborative filtering could never extract, because it is not visible in rating patterns at all.

  

---

  

## The Engineering Challenges Worth Naming

  

**Annotation drift.** The LLM annotation is not deterministic. Running the annotator on the same film twice may produce different enum values for dimensions with genuine ambiguity (e.g., whether a film is `measured` or `slow_burn` pacing is a judgment call). The mitigation is the fixed cache — annotate once, never re-annotate unless deliberately re-running. Long-term, an annotation consistency audit comparing two runs is the correct quality gate.

  

**Feature sparsity.** One-hot encoding 20 enum dimensions across 808 films produces ~140 features, most of which are boolean columns. With a training set of 808 samples, many columns will have very few positive examples. The `VarianceThreshold` and correlation filters remove the worst offenders, but the fundamental problem — not enough rating data relative to feature dimensionality — limits the taste model's precision. The target is 500+ films before trusting the R² statistics.

  

**The self-correcting loop.** The prediction engine's accuracy depends on the taste model's quality, which depends on the volume and quality of annotations, which depends on the enrichment pipeline. Any error that propagates through the pipeline — a wrong TMDB ID match, a low-confidence annotation, an outlier rating — degrades the downstream prediction accuracy without any obvious signal. The MAE curve is the only real detector: a plateau or increase in MAE after new data is added should trigger an audit of the most recently added annotations.

  

**The evaluation LLM dependency.** DeepEval's Faithfulness and Answer Relevancy metrics use an OpenAI LLM as the judge. This means the recommendation evaluation has a dependency on a paid external API, separate from the LM Studio local inference used for annotation, prediction, and recommendation. This is a conscious tradeoff: DeepEval's evaluation quality is substantially higher than any heuristic evaluation, and the cost is negligible per evaluation run (a few cents per session). The separation of concerns between the system's inference layer (local, free, LM Studio) and the evaluation layer (OpenAI) is architecturally clean.

  



