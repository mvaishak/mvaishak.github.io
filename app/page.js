import Link from 'next/link';
import resumeData from '../data/resume.json';

export default function Home() {
  const { personal, projects, experience } = resumeData;

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-[-0.05em] lowercase">
          {personal.name.toLowerCase()}
        </h1>
        <p className="text-zinc-400  text-lg leading-relaxed max-w-xl">
          machine learning engineer & data scientist. <strong className='text-white'>ms data science at uc san diego. </strong>
          building systems at the intersection of ml, generative ai, and recommender systems.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            github
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            linkedin
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            email
          </a>
        </div>
      </section>

      {/* Recent Experience */}
      <section className="space-y-8">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          experience
        </h2>
        <div className="space-y-6">
          {experience.slice(0, 2).map((job, i) => (
            <div key={i} className="border-l border-border pl-5 space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">{job.company}</span>
                <span className="font-mono text-xs text-zinc-500 shrink-0">{job.period}</span>
              </div>
              <p className="text-sm text-zinc-400">{job.title}</p>
            </div>
          ))}
        </div>
        <Link
          href="/resume"
          // className="font-mono text-xs text-zinc-500 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          className="inline-flex items-center px-4 py-2 mt-6 text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          full resume →
        </Link>
      </section>

      {/* Projects */}
      <section className="space-y-8">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          projects
        </h2>
        <div className="space-y-10">
          {projects.map((project, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-medium tracking-[-0.02em]">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline decoration-1 underline-offset-4 transition-none"
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                {project.urlLabel && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-zinc-500 shrink-0 no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
                  >
                    {project.urlLabel}
                  </a>
                )}
              </div>
              <ul className="space-y-2">
                {project.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-zinc-400 leading-relaxed pl-3 border-l border-border">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
