import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
});

export const metadata = {
  title: 'SkillSync AI — Rehearse before you perform',
  description: 'An AI interview coach: analyze your resume, rehearse real questions, and track how your answers improve.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
