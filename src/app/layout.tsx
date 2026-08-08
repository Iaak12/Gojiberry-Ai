import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gojiberry AI - Grow your sales with warm leads & high intent outreach',
  description:
    'Gojiberry AI detects warm leads from 15+ buying and social signals, filters them by your ICP, and runs personalized outreach to book qualified demos automatically.',
  openGraph: {
    type: 'website',
    title: 'Gojiberry AI - Grow your sales with warm leads & high intent outreach',
    description:
      'Gojiberry AI detects warm leads from 15+ buying and social signals, filters them by your ICP, and runs personalized outreach to book qualified demos automatically.',
    url: 'https://gojiberry.ai',
    siteName: 'Gojiberry AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gojiberry AI - Grow your sales with warm leads & high intent outreach',
    description:
      'Gojiberry AI detects warm leads from 15+ buying and social signals, filters them by your ICP, and runs personalized outreach to book qualified demos automatically.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable} ${sora.variable}`}>
      <body className="bg-[#FFF9F6] text-[#0F172A] antialiased selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]">
        {children}
      </body>
    </html>
  );
}
