import { getPostData, getAllPostSlugs } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  return { title: `${post.title} — Vaishak Menon` };
}

// U5: human-readable date format
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <article className="space-y-12">
      <header className="space-y-4 border-b border-border pb-10">
        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-500 no-underline hover:text-white hover:underline decoration-1 underline-offset-4"
        >
          ← writing
        </Link>
        <h1 className="text-2xl font-semibold tracking-[-0.05em] leading-snug mt-4">
          {post.title}
        </h1>
        <p className="font-mono text-xs text-zinc-500">{formatDate(post.date)}</p>
      </header>

      <div
        className="prose prose-invert prose-zinc max-w-none
          prose-headings:font-semibold prose-headings:tracking-[-0.04em] prose-headings:lowercase
          prose-h2:text-lg prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-zinc-300 prose-p:text-base prose-p:leading-relaxed
          prose-a:text-white prose-a:no-underline hover:prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4
          prose-code:font-mono prose-code:text-xs prose-code:text-zinc-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none
          prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border prose-pre:rounded-none prose-pre:text-xs
          prose-li:text-zinc-300 prose-li:text-base
          prose-hr:border-border
          prose-strong:text-white prose-strong:font-medium
          prose-table:text-sm prose-th:font-mono prose-th:text-xs prose-th:text-zinc-500 prose-td:text-zinc-400
          prose-blockquote:border-l-border prose-blockquote:text-zinc-500"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
