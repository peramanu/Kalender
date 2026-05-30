import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { ProfileProvider } from '@/components/providers/ProfileProvider'

export const metadata: Metadata = {
  title: 'Kalender — Die beste Kalender-App',
  description: 'Moderner Gruppenkalender mit Liquid Glass Design, Realtime-Sync und starker Personalisierung.',
  manifest: '/manifest.json',
  applicationName: 'Kalender',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kalender',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#667eea' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-[100dvh] overscroll-y-none antialiased bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#6B46C1] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]">
        <ThemeProvider>
          <SupabaseProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
