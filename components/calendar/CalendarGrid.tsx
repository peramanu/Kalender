'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, isSameDay,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { useCalendarStore } from '@/store/calendarStore'
import { useEvents, type CalendarEvent } from '@/hooks/useEvents'
import { EventModal } from './EventModal'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

interface CalendarGridProps {
  onEventClick?: (event: CalendarEvent) => void
}

export function CalendarGrid({ onEventClick }: CalendarGridProps) {
  const { currentDate, goToNext, goToPrev, setSelectedDate } = useCalendarStore()
  const { events, loading, refetch } = useEvents(currentDate)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date>(new Date())
  const [direction, setDirection] = useState(0)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  const monthStart = startOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_at), date))

  const handleDayPress = (day: Date) => {
    setSelectedDate(day)
    setModalDate(day)
    setModalOpen(true)
  }

  const handleSwipeNext = () => {
    setDirection(1)
    goToNext()
  }

  const handleSwipePrev = () => {
    setDirection(-1)
    goToPrev()
  }

  return (
    <>
      <div
        className="flex-1 glass rounded-2xl overflow-hidden flex flex-col select-none"
        onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (dragStartX === null) return
          const diff = e.changedTouches[0].clientX - dragStartX
          if (Math.abs(diff) > 50) diff < 0 ? handleSwipeNext() : handleSwipePrev()
          setDragStartX(null)
        }}
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-3 text-center text-white/40 text-xs font-medium uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid mit Slide-Animation */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={format(currentDate, 'yyyy-MM')}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="grid grid-cols-7 flex-1"
          >
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDayToday = isToday(day)
              const dayEvents = getEventsForDay(day)
              const isWeekend = day.getDay() === 0 || day.getDay() === 6

              return (
                <div
                  key={idx}
                  onClick={() => handleDayPress(day)}
                  className={`min-h-[80px] md:min-h-[100px] p-1.5 border-b border-r border-white/5 cursor-pointer active:bg-white/10 transition-colors ${
                    !isCurrentMonth ? 'opacity-25' : ''
                  } ${isWeekend && isCurrentMonth ? 'bg-white/[0.02]' : ''}`}
                >
                  {/* Tag-Nummer */}
                  <div className="flex justify-center mb-1">
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isDayToday ? 'text-white font-bold' : 'text-white/80'}`}
                      style={isDayToday ? { backgroundColor: 'var(--accent)' } : {}}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      const eventColor = event.color ?? event.calendars?.color ?? '#6366f1'
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); onEventClick?.(event) }}
                          className="text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded-md text-white truncate"
                          style={{
                            backgroundColor: `${eventColor}30`,
                            borderLeft: `2px solid ${eventColor}`,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {event.title}
                        </div>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <p className="text-[9px] text-white/40 pl-1">+{dayEvents.length - 3}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDate={modalDate}
        onSaved={refetch}
      />
    </>
  )
}
