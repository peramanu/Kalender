import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

export const metadata: Metadata = {
  title: 'Kalender — Die beste Kalender-App',
  description: 'Moderner Gruppenkalender mit Liquid Glass Design, Realtime-Sync und starker Personalisierung.',
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#6B46C1] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460]">
        <ThemeProvider>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
