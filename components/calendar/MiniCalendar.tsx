'use client'

import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, isSameDay,
  addMonths, subMonths,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useCalendarStore } from '@/store/calendarStore'

export function MiniCalendar() {
  const { currentDate, setCurrentDate, setSelectedDate } = useCalendarStore()
  const [miniDate, setMiniDate] = useState(new Date())

  const monthStart = startOfMonth(miniDate)
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(miniDate), { weekStartsOn: 1 }),
  })

  const handleDayClick = (day: Date) => {
    setCurrentDate(day)
    setSelectedDate(day)
    setMiniDate(day)
  }

  return (
    <div className="px-3 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setMiniDate(subMonths(miniDate, 1))}
          className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-white/70 text-xs font-medium">
          {format(miniDate, 'MMM yyyy', { locale: de })}
        </span>
        <button
          onClick={() => setMiniDate(addMonths(miniDate, 1))}
          className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 mb-1">
        {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-white/25 text-[9px] font-medium py-0.5">{d}</div>
        ))}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, miniDate)
          const isDayToday = isToday(day)
          const isSelected = isSameDay(day, currentDate)

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(day)}
              className={`aspect-square flex items-center justify-center rounded-full text-[11px] transition-all ${
                !isCurrentMonth ? 'text-white/15' :
                isDayToday && isSelected ? 'text-white font-bold' :
                isDayToday ? 'text-white font-semibold ring-1 ring-current' :
                isSelected ? 'text-white font-medium' :
                'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={
                isSelected
                  ? { backgroundColor: 'var(--accent)', color: 'white' }
                  : isDayToday && !isSelected
                  ? { color: 'var(--accent)' }
                  : {}
              }
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
