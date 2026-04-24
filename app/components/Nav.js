'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/blog', label: 'writing' },
  { href: '/resume', label: 'resume' },
  { href: '/contact', label: 'contact' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
      <Link
        href="/"
        className="font-mono text-sm text-white no-underline hover:underline decoration-1 underline-offset-4"
      >
        vaishak menon
      </Link>
      <div className="flex items-center gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm no-underline hover:text-white hover:underline decoration-1 underline-offset-4 ${
              pathname === href ? 'text-white' : 'text-zinc-400'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
