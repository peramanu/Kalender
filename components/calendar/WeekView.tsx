'use client'

import { motion } from 'framer-motion'
import {
  startOfWeek, endOfWeek, eachDayOfInterval, format,
  isToday, isSameDay, eachHourOfInterval, startOfDay, endOfDay, differenceInMinutes
} from 'date-fns'
import { de } from 'date-fns/locale'
import { useCalendarStore } from '@/store/calendarStore'
import { CalendarEvent } from '@/hooks/useEvents'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface WeekViewProps {
  events: CalendarEvent[]
  onDayClick: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export function WeekView({ events, onDayClick, onEventClick }: WeekViewProps) {
  const { currentDate } = useCalendarStore()
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: endOfWeek(currentDate, { weekStartsOn: 1 }) })

  const now = new Date()
  const nowPercent = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_at), date) && !e.all_day)

  const getTopPercent = (event: CalendarEvent) => {
    const start = new Date(event.start_at)
    const minutes = start.getHours() * 60 + start.getMinutes()
    return (minutes / 1440) * 100
  }

  const getHeightPercent = (event: CalendarEvent) => {
    const mins = differenceInMinutes(new Date(event.end_at), new Date(event.start_at))
    return Math.max((mins / 1440) * 100, 2)
  }

  const allDayEvents = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_at), date) && e.all_day)

  return (
    <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
      {/* Header Row */}
      <div className="grid border-b border-white/10" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
        <div className="border-r border-white/10" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => onDayClick(day)}
            className="py-2 text-center border-r border-white/5 cursor-pointer"
          >
            <p className="text-white/40 text-xs uppercase">{format(day, 'EEE', { locale: de })}</p>
            <p className={`text-sm font-semibold w-7 h-7 mx-auto flex items-center justify-center rounded-full mt-0.5 ${
              isToday(day) ? 'bg-indigo-500 text-white' : 'text-white/80'
            }`}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* All-day row */}
      <div className="grid border-b border-white/10" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
        <div className="border-r border-white/10 py-1 px-1">
          <span className="text-white/20 text-[9px]">ganzt.</span>
        </div>
        {days.map((day) => (
          <div key={day.toISOString()} className="border-r border-white/5 py-1 px-0.5 min-h-[24px]">
            {allDayEvents(day).map((e) => (
              <div
                key={e.id}
                className="text-[10px] text-white font-medium px-1 py-0.5 rounded truncate mb-0.5"
                style={{ backgroundColor: `${e.color ?? e.calendars?.color ?? '#6366f1'}50` }}
              >
                {e.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="relative grid" style={{ gridTemplateColumns: '48px repeat(7, 1fr)', minHeight: '1152px' }}>
          {/* Hour Lines */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="contents"
            >
              <div className="border-r border-white/10 border-b border-white/5 h-12 flex items-start justify-end pr-2 pt-0.5">
                {hour > 0 && <span className="text-white/25 text-[10px]">{String(hour).padStart(2, '0')}:00</span>}
              </div>
              {days.map((day) => (
                <div
                  key={`${hour}-${day.toISOString()}`}
                  className="border-r border-white/5 border-b border-white/5 h-12"
                  onClick={() => {
                    const d = new Date(day)
                    d.setHours(hour, 0)
                    onDayClick(d)
                  }}
                />
              ))}
            </div>
          ))}

          {/* Aktuelle Zeit */}
          {days.map((day, dayIdx) => isToday(day) ? (
            <div
              key={`now-${dayIdx}`}
              className="absolute z-20 pointer-events-none"
              style={{
                top: `${nowPercent}%`,
                left: `calc(48px + ${dayIdx} * ((100% - 48px) / 7))`,
                width: `calc((100% - 48px) / 7)`,
              }}
            >
              <div className="h-0.5 bg-red-500 relative">
                <div className="absolute -left-1 -top-[3px] w-2 h-2 rounded-full bg-red-500" />
              </div>
            </div>
          ) : null)}

          {/* Events overlay */}
          {days.map((day, dayIdx) => (
            <div
              key={day.toISOString()}
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: `calc(48px + ${dayIdx} * ((100% - 48px) / 7))`,
                width: `calc((100% - 48px) / 7)`,
              }}
            >
              {getEventsForDay(day).map((event) => {
                const eventColor = event.color ?? event.calendars?.color ?? '#6366f1'
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="absolute left-0.5 right-0.5 rounded-lg px-1.5 py-1 pointer-events-auto cursor-pointer overflow-hidden"
                    style={{
                      top: `${getTopPercent(event)}%`,
                      height: `${getHeightPercent(event)}%`,
                      backgroundColor: `${eventColor}40`,
                      borderLeft: `3px solid ${eventColor}`,
                    }}
                  >
                    <p className="text-white text-[10px] font-medium leading-tight truncate">{event.title}</p>
                    <p className="text-white/50 text-[9px]">
                      {format(new Date(event.start_at), 'HH:mm')}
                    </p>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
