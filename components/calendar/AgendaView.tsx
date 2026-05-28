'use client'

import { format, isToday, isFuture, isPast, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { CalendarEvent } from '@/hooks/useEvents'

interface AgendaViewProps {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function AgendaView({ events, onEventClick }: AgendaViewProps) {
  // Gruppiere Events nach Datum
  const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const key = format(new Date(event.start_at), 'yyyy-MM-dd')
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort()

  if (sortedDates.length === 0) {
    return (
      <div className="flex-1 glass rounded-2xl flex flex-col items-center justify-center text-center p-8">
        <Calendar className="w-12 h-12 text-indigo-400/50 mb-3" />
        <p className="text-white/50 font-medium">Keine Events diesen Monat</p>
        <p className="text-white/30 text-sm mt-1">Tippe auf + um ein Event zu erstellen</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-thin space-y-3 pb-24 md:pb-6">
      {sortedDates.map((dateKey) => {
        const date = new Date(dateKey)
        const dayEvents = grouped[dateKey]

        return (
          <div key={dateKey}>
            {/* Datum Header */}
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className={`w-10 h-10 flex flex-col items-center justify-center rounded-xl flex-shrink-0 ${
                isToday(date)
                  ? 'bg-indigo-500 text-white'
                  : isPast(date)
                  ? 'bg-white/5 text-white/40'
                  : 'bg-white/10 text-white'
              }`}>
                <span className="text-[10px] uppercase font-medium leading-none">
                  {format(date, 'EEE', { locale: de })}
                </span>
                <span className="text-lg font-bold leading-tight">
                  {format(date, 'd')}
                </span>
              </div>
              <div>
                <p className={`font-medium text-sm ${isToday(date) ? 'text-indigo-400' : isPast(date) ? 'text-white/40' : 'text-white'}`}>
                  {isToday(date) ? 'Heute' : format(date, 'EEEE, d. MMMM', { locale: de })}
                </p>
                <p className="text-white/30 text-xs">{dayEvents.length} Event{dayEvents.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Events */}
            <div className="space-y-2 ml-0">
              {dayEvents.map((event) => {
                const eventColor = event.color ?? event.calendars?.color ?? '#6366f1'
                const past = isPast(new Date(event.end_at))

                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`glass rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform ${
                      past ? 'opacity-50' : ''
                    }`}
                    style={{ borderLeft: `4px solid ${eventColor}` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{event.title}</p>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                          {!event.all_day && (
                            <div className="flex items-center gap-1 text-white/50 text-xs">
                              <Clock className="w-3 h-3" />
                              {format(new Date(event.start_at), 'HH:mm')} – {format(new Date(event.end_at), 'HH:mm')}
                            </div>
                          )}
                          {event.all_day && (
                            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">Ganztägig</span>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1 text-white/50 text-xs">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-white/40 text-xs mt-1.5 line-clamp-2">{event.description}</p>
                        )}
                      </div>

                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: eventColor }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
