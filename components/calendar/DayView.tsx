'use client'

import { format, isToday, isSameDay, differenceInMinutes } from 'date-fns'
import { de } from 'date-fns/locale'
import { useCalendarStore } from '@/store/calendarStore'
import { CalendarEvent } from '@/hooks/useEvents'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface DayViewProps {
  events: CalendarEvent[]
  onTimeClick: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export function DayView({ events, onTimeClick, onEventClick }: DayViewProps) {
  const { currentDate } = useCalendarStore()

  const now = new Date()
  const nowPercent = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100

  const dayEvents = events.filter(
    (e) => isSameDay(new Date(e.start_at), currentDate) && !e.all_day
  )
  const allDayEvents = events.filter(
    (e) => isSameDay(new Date(e.start_at), currentDate) && e.all_day
  )

  const getTopPercent = (event: CalendarEvent) => {
    const start = new Date(event.start_at)
    return ((start.getHours() * 60 + start.getMinutes()) / 1440) * 100
  }

  const getHeightPercent = (event: CalendarEvent) => {
    const mins = differenceInMinutes(new Date(event.end_at), new Date(event.start_at))
    return Math.max((mins / 1440) * 100, 2.5)
  }

  return (
    <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-4 border-b border-white/10 gap-3">
        <div className="text-center">
          <p className="text-white/50 text-sm uppercase tracking-wide">
            {format(currentDate, 'EEEE', { locale: de })}
          </p>
          <p className={`text-3xl font-bold mt-0.5 w-12 h-12 flex items-center justify-center rounded-full mx-auto ${
            isToday(currentDate) ? 'bg-indigo-500 text-white' : 'text-white'
          }`}>
            {format(currentDate, 'd')}
          </p>
        </div>
      </div>

      {/* All-day Events */}
      {allDayEvents.length > 0 && (
        <div className="px-4 py-2 border-b border-white/10 space-y-1">
          {allDayEvents.map((e) => (
            <div
              key={e.id}
              className="text-sm text-white font-medium px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: `${e.color ?? e.calendars?.color ?? '#6366f1'}40` }}
            >
              {e.title}
            </div>
          ))}
        </div>
      )}

      {/* Time Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="relative" style={{ minHeight: '1152px' }}>
          {/* Hours */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-white/5 h-12"
              onClick={() => {
                const d = new Date(currentDate)
                d.setHours(hour, 0)
                onTimeClick(d)
              }}
            >
              <div className="w-14 flex-shrink-0 flex items-start justify-end pr-3 pt-0.5">
                {hour > 0 && (
                  <span className="text-white/25 text-[11px]">{String(hour).padStart(2, '0')}:00</span>
                )}
              </div>
              <div className="flex-1 border-l border-white/10 hover:bg-white/5 transition-colors cursor-pointer" />
            </div>
          ))}

          {/* Aktuelle Zeit */}
          {isToday(currentDate) && (
            <div className="absolute left-14 right-2 z-20 pointer-events-none" style={{ top: `${nowPercent}%` }}>
              <div className="h-0.5 bg-red-500 relative">
                <div className="absolute -left-1.5 -top-[3px] w-2.5 h-2.5 rounded-full bg-red-500 shadow shadow-red-500/50" />
              </div>
            </div>
          )}

          {/* Events Overlay */}
          <div className="absolute top-0 left-14 right-0 bottom-0 pointer-events-none">
            {dayEvents.map((event) => {
              const eventColor = event.color ?? event.calendars?.color ?? '#6366f1'
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="absolute left-2 right-2 rounded-xl px-3 py-2 pointer-events-auto cursor-pointer"
                  style={{
                    top: `${getTopPercent(event)}%`,
                    height: `${getHeightPercent(event)}%`,
                    backgroundColor: `${eventColor}35`,
                    border: `1px solid ${eventColor}60`,
                    borderLeft: `4px solid ${eventColor}`,
                  }}
                >
                  <p className="text-white font-semibold text-sm leading-tight truncate">{event.title}</p>
                  <p className="text-white/60 text-xs mt-0.5">
                    {format(new Date(event.start_at), 'HH:mm')} – {format(new Date(event.end_at), 'HH:mm')}
                  </p>
                  {event.location && (
                    <p className="text-white/40 text-xs truncate mt-0.5">📍 {event.location}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
