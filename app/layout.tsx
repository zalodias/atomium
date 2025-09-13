'use client';

import '@/app/globals.css';
import { Bricolage_Grotesque } from 'next/font/google';

const font = Bricolage_Grotesque({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Atomium</title>
        <meta name="description" content="Atomium" />
      </head>
      <body
        className={`${font.className} bg-background-neutral-default text-foreground-neutral-default flex min-h-dvh flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
