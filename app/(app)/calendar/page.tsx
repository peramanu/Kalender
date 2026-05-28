'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { WeekView } from '@/components/calendar/WeekView'
import { DayView } from '@/components/calendar/DayView'
import { AgendaView } from '@/components/calendar/AgendaView'
import { EventModal } from '@/components/calendar/EventModal'
import { EventDetailModal } from '@/components/calendar/EventDetailModal'
import { useCalendarStore } from '@/store/calendarStore'
import { useEvents, type CalendarEvent } from '@/hooks/useEvents'

export default function CalendarPage() {
  const { view, currentDate } = useCalendarStore()
  const { events, refetch } = useEvents(currentDate)
  const [createOpen, setCreateOpen] = useState(false)
  const [createDate, setCreateDate] = useState<Date>(new Date())
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)

  const openCreate = (date: Date) => {
    setCreateDate(date)
    setCreateOpen(true)
  }

  return (
    <div className="flex flex-col h-full gap-3">
      <CalendarHeader />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {view === 'month' && <CalendarGrid onEventClick={setDetailEvent} />}
          {view === 'week' && <WeekView events={events} onDayClick={openCreate} onEventClick={setDetailEvent} />}
          {view === 'day' && <DayView events={events} onTimeClick={openCreate} onEventClick={setDetailEvent} />}
          {view === 'agenda' && <AgendaView events={events} onEventClick={setDetailEvent} />}
        </motion.div>
      </AnimatePresence>

      {/* Event erstellen */}
      <EventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initialDate={createDate}
        onSaved={refetch}
      />

      {/* Event Detail */}
      <EventDetailModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onDeleted={refetch}
        onEdited={() => {
          setCreateDate(new Date(detailEvent!.start_at))
          setDetailEvent(null)
          setCreateOpen(true)
        }}
      />
    </div>
  )
}
