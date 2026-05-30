'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Trash2, Edit3, Calendar, AlignLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import type { CalendarEvent } from '@/hooks/useEvents'

interface EventDetailModalProps {
  event: CalendarEvent | null
  onClose: () => void
  onDeleted: () => void
  onEdited: () => void
}

export function EventDetailModal({ event, onClose, onDeleted, onEdited }: EventDetailModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!event) return null

  const eventColor = event.color ?? event.calendars?.color ?? '#6366f1'

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('events').delete().eq('id', event.id)
    onDeleted()
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md"
      >
        <div className="glass rounded-t-3xl md:rounded-2xl overflow-hidden">
          {/* Farbband oben */}
          <div className="h-1.5 w-full" style={{ backgroundColor: eventColor }} />

          <div className="p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-6">
            {/* Handle mobile */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                  style={{ backgroundColor: eventColor }}
                />
                <h2 className="text-white font-bold text-xl leading-tight">{event.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Datum & Uhrzeit */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                <div>
                  {event.all_day ? (
                    <p className="text-white/80 text-sm">
                      {format(new Date(event.start_at), 'EEEE, d. MMMM yyyy', { locale: de })}
                    </p>
                  ) : (
                    <>
                      <p className="text-white/80 text-sm">
                        {format(new Date(event.start_at), 'EEEE, d. MMMM yyyy', { locale: de })}
                      </p>
                      <p className="text-white/50 text-sm">
                        {format(new Date(event.start_at), 'HH:mm')} – {format(new Date(event.end_at), 'HH:mm')} Uhr
                      </p>
                    </>
                  )}
                  {event.all_day && (
                    <span className="inline-block mt-1 text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">Ganztägig</span>
                  )}
                </div>
              </div>

              {/* Kalender */}
              {event.calendars?.name && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <p className="text-white/60 text-sm">{event.calendars.name}</p>
                </div>
              )}

              {/* Ort */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm">{event.location}</p>
                </div>
              )}

              {/* Beschreibung */}
              {event.description && (
                <div className="flex items-start gap-3">
                  <AlignLeft className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
                </div>
              )}
            </div>

            {/* Aktionen */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                  confirmDelete
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {confirmDelete ? 'Wirklich löschen?' : 'Löschen'}
              </button>

              <button
                onClick={onEdited}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium transition-all"
                style={{ backgroundColor: eventColor }}
              >
                <Edit3 className="w-4 h-4" />
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
