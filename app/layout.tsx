import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

const title = 'Sherin';
const description =
  'Self-hosted private workspace for generative media. Built for creators, artists, designers, and developers who want their own key, domain, and storage.';
const socialImageUrl = 'https://cdn.babysea.live/assets/oss/sherin-card.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://demo.sherin.babysea.live'),
  applicationName: title,
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    'babysea',
    'open-source',
    'starter-pack',
    'black-forest-labs',
    'supabase',
    'vercel-blob',
    'cloudflare-r2',
    'aws-s3',
    'vercel',
    'netlify',
    'ai-infrastructure',
    'control-plane',
    'execution-layer',
    'developer-tools',
    'generative-ai',
    'inference-providers',
    'image-generation',
    'multimodal',
    'generative-media',
    'creative-tools',
  ],
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title,
    description,
    images: [
      {
        alt: title,
        height: 630,
        url: socialImageUrl,
        width: 1200,
      },
    ],
    siteName: title,
    type: 'website',
    url: '/',
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
