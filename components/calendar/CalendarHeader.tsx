'use client'

import { LayoutGrid, List, AlignJustify, Clock } from 'lucide-react'

type CalendarView = 'month' | 'week' | 'day' | 'agenda'

const views: { id: CalendarView; label: string; icon: React.ElementType }[] = [
  { id: 'month', label: 'Monat', icon: LayoutGrid },
  { id: 'week', label: 'Woche', icon: AlignJustify },
  { id: 'day', label: 'Tag', icon: Clock },
  { id: 'agenda', label: 'Agenda', icon: List },
]

export function CalendarHeader() {
  // TODO: Zustand Store
  const currentView: CalendarView = 'month'

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-white font-semibold text-xl hidden sm:block">Mein Kalender</h1>

      {/* View Switcher */}
      <div className="glass rounded-glass p-1 flex items-center gap-1">
        {views.map((view) => (
          <button
            key={view.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all ${
              currentView === view.id
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <view.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
