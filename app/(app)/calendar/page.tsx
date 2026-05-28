'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { WeekView } from '@/components/calendar/WeekView'
import { DayView } from '@/components/calendar/DayView'
import { AgendaView } from '@/components/calendar/AgendaView'
import { EventModal } from '@/components/calendar/EventModal'
import { useCalendarStore } from '@/store/calendarStore'
import { useEvents } from '@/hooks/useEvents'

export default function CalendarPage() {
  const { view, currentDate } = useCalendarStore()
  const { events, refetch } = useEvents(currentDate)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date>(new Date())

  const openModal = (date: Date) => {
    setModalDate(date)
    setModalOpen(true)
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
          {view === 'month' && <CalendarGrid />}
          {view === 'week' && <WeekView events={events} onDayClick={openModal} />}
          {view === 'day' && <DayView events={events} onTimeClick={openModal} />}
          {view === 'agenda' && <AgendaView events={events} onEventClick={() => {}} />}
        </motion.div>
      </AnimatePresence>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialDate={modalDate}
        onSaved={refetch}
      />
    </div>
  )
}
