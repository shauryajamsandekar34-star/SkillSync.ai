'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/resume', label: 'Resume Analysis' },
  { href: '/interview', label: 'Mock Interview' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function NavBar() {
  const pathname = usePathname();
  const onDarkHero = pathname === '/';

  return (
    <header
      className={
        onDarkHero
          ? 'bg-ink text-paper'
          : 'bg-paper text-ink border-b border-ink/10'
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight">
          SkillSync <span className="text-amber">AI</span>
        </Link>
        <nav className="flex gap-6 text-sm font-body">
          {links.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-amber font-medium'
                  : onDarkHero
                  ? 'text-paper/70 hover:text-paper'
                  : 'text-slate hover:text-ink'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
