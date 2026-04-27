import resumeData from '../../data/resume.json';

export const metadata = {
  title: 'Contact — Vaishak Menon',
};

export default function ContactPage() {
  const { personal } = resumeData;

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-[-0.05em] lowercase">contact</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
          open to research collaborations, ml engineering roles, and interesting problems.
        </p>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">direct</p>
          <a
            href={`mailto:${personal.email}`}
            className="text-sm no-underline hover:underline decoration-1 underline-offset-4"
          >
            {personal.email}
          </a>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">elsewhere</p>
          <div className="flex flex-col gap-2">
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
            >
              linkedin →
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
            >
              github →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
