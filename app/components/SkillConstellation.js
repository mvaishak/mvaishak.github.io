const skillGroups = [
  {
    label: 'languages',
    skills: [
      { name: 'Python', weight: 3 },
      { name: 'SQL', weight: 3 },
      { name: 'PySpark', weight: 3 },
      { name: 'R', weight: 2 },
    ],
  },
  {
    label: 'ml / ai',
    skills: [
      { name: 'PyTorch', weight: 3 },
      { name: 'XGBoost', weight: 3 },
      { name: 'LightGBM', weight: 3 },
      { name: 'Transformers', weight: 3 },
      { name: 'A/B Testing', weight: 3 },
      { name: 'Contrastive Learning', weight: 2 },
      { name: 'Recommender Systems', weight: 2 },
      { name: 'scikit-learn', weight: 2 },
      { name: 'Time-Series', weight: 2 },
    ],
  },
  {
    label: 'genai',
    skills: [
      { name: 'RAG', weight: 3 },
      { name: 'LangGraph', weight: 3 },
      { name: 'Multi-Agent', weight: 3 },
      { name: 'GraphRAG', weight: 3 },
      { name: 'Qdrant', weight: 3 },
      { name: 'KV-Cache', weight: 2 },
      { name: 'LangChain', weight: 2 },
    ],
  },
  {
    label: 'mlops',
    skills: [
      { name: 'Databricks', weight: 3 },
      { name: 'AWS', weight: 3 },
      { name: 'MLflow', weight: 3 },
      { name: 'Langfuse', weight: 3 },
      { name: 'Docker', weight: 2 },
      { name: 'DeepEval', weight: 2 },
      { name: 'RAGAS', weight: 2 },
    ],
  },
];

export default function SkillConstellation() {
  return (
    <section className="space-y-6">
      <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">stack</h2>
      <div className="space-y-3">
        {skillGroups.map((group) => (
          <div key={group.label} className="flex gap-6 items-baseline">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest shrink-0 w-16">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {group.skills.map((skill) => (
                <span
                  key={skill.name}
                  className={
                    skill.weight === 3
                      ? 'text-sm text-white font-medium'
                      : 'text-sm text-zinc-500'
                  }
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
