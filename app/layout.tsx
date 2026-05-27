import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

export const metadata: Metadata = {
  title: 'Kalender — Die beste Kalender-App',
  description: 'Moderner Gruppenkalender mit Liquid Glass Design, Realtime-Sync und starker Personalisierung.',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
