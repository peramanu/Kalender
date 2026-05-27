'use client'

import { useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns'
import { de } from 'date-fns/locale'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

// Beispiel-Events (später aus Supabase)
const sampleEvents = [
  { id: '1', title: 'Team Meeting', date: new Date(), color: '#6366f1', allDay: false },
  { id: '2', title: 'Geburtstag Lisa', date: new Date(new Date().setDate(new Date().getDate() + 3)), color: '#f59e0b', allDay: true },
  { id: '3', title: 'Arzttermin', date: new Date(new Date().setDate(new Date().getDate() + 7)), color: '#10b981', allDay: false },
]

export function CalendarGrid() {
  const [currentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getEventsForDay = (date: Date) =>
    sampleEvents.filter((e) => isSameDay(e.date, date))

  return (
    <div className="flex-1 glass rounded-glass-xl overflow-hidden flex flex-col">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-white/40 text-xs font-medium uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1 overflow-auto">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const dayEvents = getEventsForDay(day)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[90px] md:min-h-[110px] p-2 border-b border-r border-white/5 cursor-pointer transition-all ${
                isCurrentMonth ? '' : 'opacity-30'
              } ${isWeekend && isCurrentMonth ? 'bg-white/[0.02]' : ''} ${
                isSelected ? 'bg-indigo-500/10 border-indigo-500/20' : 'hover:bg-white/5'
              }`}
            >
              {/* Day Number */}
              <div className="flex justify-end mb-1">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                    isDayToday
                      ? 'bg-indigo-500 text-white font-bold'
                      : isCurrentMonth
                      ? 'text-white/80 hover:bg-white/10'
                      : 'text-white/30'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-[11px] font-medium px-1.5 py-0.5 rounded text-white truncate"
                    style={{ backgroundColor: `${event.color}40`, borderLeft: `2px solid ${event.color}` }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-white/40 pl-1">
                    +{dayEvents.length - 3} weitere
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
