import './globals.css'
import type { Metadata } from 'next'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Analytics } from '@vercel/analytics/react';
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'tweetify',
  description: 'A Tweet Generator that uses AI to generate tweets based on a topic and style.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}