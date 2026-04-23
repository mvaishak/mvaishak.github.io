import resumeData from '../../data/resume.json';

export const metadata = {
  title: 'Resume — Vaishak Menon',
};

export default function ResumePage() {
  const { personal, education, experience, skills, projects } = resumeData;

  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-[-0.05em] lowercase">
          {personal.name.toLowerCase()}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-zinc-500">
          <span>{personal.location}</span>
          <a
            href={`mailto:${personal.email}`}
            className="no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            {personal.email}
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            linkedin
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-white hover:underline decoration-1 underline-offset-4 transition-none"
          >
            github
          </a>
        </div>
      </section>

      {/* Education */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-border pb-3">
          education
        </h2>
        <div className="space-y-8">
          {education.map((edu, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-sm">{edu.institution}</span>
                <span className="font-mono text-xs text-zinc-500 shrink-0">{edu.period}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-zinc-400 italic">{edu.degree}</span>
                <span className="font-mono text-xs text-zinc-500 shrink-0">{edu.location}</span>
              </div>
              <p className="font-mono text-xs text-zinc-500">gpa: {edu.gpa}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="text-zinc-400">coursework: </span>
                {edu.coursework.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-border pb-3">
          experience
        </h2>
        <div className="space-y-10">
          {experience.map((job, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-sm">
                  {job.company} <span className="text-zinc-500 font-normal">/ {job.title}</span>
                </span>
                <span className="font-mono text-xs text-zinc-500 shrink-0">{job.period}</span>
              </div>
              <ul className="space-y-2">
                {job.bullets.map((bullet, j) => (
                  <li key={j} className="text-sm text-zinc-400 leading-relaxed flex gap-3">
                    <span className="text-zinc-600 shrink-0 font-mono">—</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-border pb-3">
          skills
        </h2>
        <div className="space-y-4">
          {skills.map((skillGroup, i) => (
            <div key={i} className="flex gap-4">
              <span className="font-mono text-xs text-zinc-500 shrink-0 w-40 pt-0.5">
                {skillGroup.category.toLowerCase()}
              </span>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {skillGroup.items.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-border pb-3">
          projects
        </h2>
        <div className="space-y-10">
          {projects.map((project, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-sm">
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
                </span>
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
                  <li key={j} className="text-sm text-zinc-400 leading-relaxed flex gap-3">
                    <span className="text-zinc-600 shrink-0 font-mono">—</span>
                    <span>{bullet}</span>
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
