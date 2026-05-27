'use client'

import { Bell, Search, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const today = new Date()

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center px-4 md:px-6 gap-4">
      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-glass hover:bg-white/10 text-white/50 hover:text-white transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-medium text-sm hidden sm:block">
          {format(today, 'MMMM yyyy', { locale: de })}
        </span>
        <button className="p-1.5 rounded-glass hover:bg-white/10 text-white/50 hover:text-white transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="ml-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-glass transition-all">
          Heute
        </button>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Events suchen..."
            className="w-full bg-white/5 border border-white/10 rounded-glass text-white placeholder-white/30 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-400/40 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-glass hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-glass hover:bg-white/10 text-white/50 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-indigo-400 transition-colors">
          M
        </button>
      </div>
    </header>
  )
}
