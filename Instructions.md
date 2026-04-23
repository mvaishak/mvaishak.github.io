Act as a Senior Frontend Engineer specializing in Next.js, Tailwind CSS, and semantic, high-end typography. I need you to build a complete, production-ready personal portfolio website that is highly optimized for Static Site Generation (SSG) to be hosted on GitHub Pages.

I will provide two text inputs at the end of this prompt:

1. **Input A:** My Resume in raw LaTeX (`.tex`) format.
    
2. **Input B:** My first blog post in Markdown (`.md`) format (with frontmatter).
    

Please generate the file structure and full code for a Next.js (App Router) application that implements the following specification.

### 1. Design Aesthetic: 'Pure Minimalist' (The Researcher)

You must adhere strictly to this design system. Do not use standard component libraries.

- **Color Palette:** Strict 'Paper & Ink'. Pure black background (`#000000`) or extreme charcoal (`#09090b`) and pure white text (`#ffffff`). Use thin 1px borders (`#27272a`) for separation. No background gradients, no box shadows.
    
- **Typography:** Utilize `next/font` for optimal loading. Use **'Geist Sans'** for the body and **'Geist Mono'** for data, dates, and code snippets.
    
- **Styling Rules:** All headings must be lowercase. Use extreme whitespace. Set letter-spacing (tracking) for headings to `-0.05em`.
    
- **Interactions:** Transitions must be instant (no spring physics). Use simple 1px solid underlines on hover for links.
    

### 2. Architecture for Easy Content Management (CRITICAL)

The site must be built so that a non-frontend developer can update content without touching React code.

#### A. Resume Data Extraction & Setup (Input A: LaTeX)

- **Data Separation:** You must parse the provided raw LaTeX text and convert it entirely into a structured JSON file located at `data/resume.json`. This JSON must capture all sections: Education, Experience, Skills, and Projects.
    
- **UI Integration:** The React components on the Home page and Resume page must import `data/resume.json` and map over the data to render the UI. **Do not hardcode my resume text into any `.js` or `.tsx` files.**
    

#### B. Blog Implementation (Input B: Markdown Post)

- **Storage:** Set up the project structure to read Markdown files from a `content/posts/` directory. New posts will simply be dropped into this folder.
    
- **Processing:** Write the required `lib/posts.js` utility using `gray-matter`, `remark`, and `remark-html` to parse the provided Markdown post.
    
- **Typography:** The post detail page (`app/blog/[slug]/page.js`) must use `@tailwindcss/typography` tailored for the minimalist style (`prose prose-invert prose-zinc max-w-none`).
    

#### C. Pages & Features

- **Home (`app/page.js`):** Hero section, dynamic project list mapped from `data/resume.json`.
    
- **Resume (`app/resume/page.js`):** A beautiful, semantically coded web version of the resume that maps over `data/resume.json`.
    
- **Contact (`app/contact/page.js`):** A simple contact form styled to the aesthetic. Use static HTML attributes (action='URL', method='POST').
    

### 3. Engineering Requirements (Crucial for GitHub Pages)

- **`next.config.mjs`:** Must be configured for static export (`output: 'export'`) and images must be set to `unoptimized: true`.
    
- **Tailwind Config:** Include the typography plugin. Configure the specific black/white colors and Geist fonts.
    

### 4. Required Output Format

Please provide the complete, functional code for **every file** in the setup, organized by file path (e.g., `package.json`, `next.config.mjs`, `tailwind.config.ts`, `data/resume.json`, `app/layout.js`, `lib/posts.js`, `app/blog/[slug]/page.js`, etc.). Assume I have a fresh Next.js installation.

---

Extract data from the following sources

### INPUT A: RAW LATEX RESUME : Present in resume.tex 
### INPUT B: MARKDOWN BLOG POST : Present is first-post.md