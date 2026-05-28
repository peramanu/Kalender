'use client'

import { LayoutGrid, List, AlignJustify, Clock } from 'lucide-react'
import { useCalendarStore } from '@/store/calendarStore'

type CalendarView = 'month' | 'week' | 'day' | 'agenda'

const views: { id: CalendarView; label: string; icon: React.ElementType }[] = [
  { id: 'month', label: 'Monat', icon: LayoutGrid },
  { id: 'week', label: 'Woche', icon: AlignJustify },
  { id: 'day', label: 'Tag', icon: Clock },
  { id: 'agenda', label: 'Liste', icon: List },
]

export function CalendarHeader() {
  const { view, setView } = useCalendarStore()

  return (
    <div className="flex items-center justify-between px-1">
      <h1 className="text-white font-semibold text-lg hidden sm:block">Kalender</h1>

      {/* View Switcher */}
      <div className="glass rounded-xl p-1 flex items-center gap-0.5 w-full sm:w-auto">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-medium transition-all ${
              view === v.id
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-white/50 hover:text-white active:bg-white/10'
            }`}
          >
            <v.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
