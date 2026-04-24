import Link from 'next/link';
import resumeData from '../data/resume.json';
import SkillConstellation from './components/SkillConstellation';
import NowSection from './components/NowSection';
import NowMobile from './components/NowMobile';

export default function Home() {
  const { personal, projects, experience } = resumeData;

  return (
    <div className="space-y-24">

      {/* ── Top fold: hero + stack ╱ now sidebar ────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[1fr_256px] lg:gap-16 lg:items-start">

        <div className="space-y-12">
          <section className="space-y-6">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-[-0.05em] lowercase leading-none">
              {personal.name.toLowerCase()}
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              machine learning engineer &amp; data scientist.{' '}
              <strong className="text-white">ms data science at uc san diego.</strong>{' '}
              building large-scale recommendation engines and multi-agent rag pipelines.
            </p>
            <div className="flex items-center gap-6">
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
              >
                github
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
              >
                linkedin
              </a>
              <a
                href={`mailto:${personal.email}`}
                className="font-mono text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
              >
                email
              </a>
            </div>
          </section>

          <SkillConstellation />

          <NowMobile />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <NowSection />
          </div>
        </aside>

      </div>

      {/* ── Bottom: projects + experience full page width ───────────────── */}
      <div className="space-y-24">

        <section className="space-y-8">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">projects</h2>
          <div>
            {projects.map((project, i) => (
              <div
                key={i}
                className={`space-y-3 py-6 ${i !== 0 ? 'border-t border-border' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-medium tracking-[-0.02em]">
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:underline decoration-1 underline-offset-4"
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
                      className="font-mono text-xs text-zinc-500 shrink-0 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
                    >
                      {project.urlLabel}
                    </a>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {project.bullets.map((bullet, j) => (
                    <li key={j} className="text-sm text-zinc-300 leading-relaxed flex gap-3">
                      <span className="text-zinc-600 shrink-0 font-mono">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">experience</h2>
          <div className="space-y-8">
            {experience.map((job, i) => (
              <div key={i} className="border-l border-border pl-5 space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-medium">{job.company}</span>
                  <span className="font-mono text-xs text-zinc-500 shrink-0">{job.period}</span>
                </div>
                <p className="text-sm text-zinc-400">{job.title}</p>
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                  {job.bullets[0]}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/resume"
            className="inline-flex items-center px-4 py-2 text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            full resume →
          </Link>
        </section>

      </div>

    </div>
  );
}
