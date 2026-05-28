'use client'

import { Bell, Search, Sun, Moon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCalendarStore } from '@/store/calendarStore'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useState } from 'react'
import { EventModal } from '@/components/calendar/EventModal'

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const { currentDate, goToPrev, goToNext, goToToday } = useCalendarStore()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <header className="h-14 md:h-16 glass border-b border-white/10 flex items-center px-4 gap-3 sticky top-0 z-30">
        {/* Datum Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={goToToday}
            className="px-2.5 py-1.5 text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all active:bg-white/10"
          >
            Heute
          </button>

          <button
            onClick={goToNext}
            className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Monat/Jahr */}
        <span className="text-white font-semibold text-sm md:text-base">
          {format(currentDate, 'MMMM yyyy', { locale: de })}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle — nur Desktop */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="hidden md:flex p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          </button>

          {/* Neues Event — FAB-Style Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-medium px-3 py-2 rounded-xl transition-all text-sm ml-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Event</span>
          </button>
        </div>
      </header>

      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
