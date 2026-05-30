'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Calendar, AlignLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { CalendarEvent } from '@/hooks/useEvents'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#10b981', '#06b6d4',
]

interface EventModalProps {
  open: boolean
  onClose: () => void
  initialDate?: Date
  editEvent?: CalendarEvent
  onSaved?: () => void
}

export function EventModal({ open, onClose, initialDate, editEvent, onSaved }: EventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [allDay, setAllDay] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill for editing or reset for creating
  useEffect(() => {
    if (!open) return

    if (editEvent) {
      setTitle(editEvent.title)
      setDescription(editEvent.description ?? '')
      setLocation(editEvent.location ?? '')
      setColor(editEvent.color ?? '#6366f1')
      setAllDay(editEvent.all_day)
      setStartDate(format(new Date(editEvent.start_at), "yyyy-MM-dd'T'HH:mm"))
      setEndDate(format(new Date(editEvent.end_at), "yyyy-MM-dd'T'HH:mm"))
    } else {
      const base = initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      const hour = String(new Date().getHours()).padStart(2, '0')
      const nextHour = String(Math.min(new Date().getHours() + 1, 23)).padStart(2, '0')
      setTitle('')
      setDescription('')
      setLocation('')
      setColor('#6366f1')
      setAllDay(false)
      setStartDate(`${base}T${hour}:00`)
      setEndDate(`${base}T${nextHour}:00`)
    }
  }, [open, editEvent, initialDate])

  const handleSave = async () => {
    if (!title.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const eventData = {
      title: title.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      color,
      start_at: allDay ? `${startDate.split('T')[0]}T00:00:00+00:00` : new Date(startDate).toISOString(),
      end_at: allDay ? `${startDate.split('T')[0]}T23:59:59+00:00` : new Date(endDate).toISOString(),
      all_day: allDay,
    }

    if (editEvent) {
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editEvent.id)

      if (updateError) {
        setError('Fehler beim Speichern.')
        setLoading(false)
        return
      }
    } else {
      // Get or create personal calendar
      let { data: calendar } = await supabase
        .from('calendars')
        .select('id')
        .eq('owner_id', user.id)
        .eq('type', 'personal')
        .single()

      if (!calendar) {
        const { data: newCal } = await supabase
          .from('calendars')
          .insert({ name: 'Mein Kalender', color: '#6366f1', type: 'personal', owner_id: user.id })
          .select('id')
          .single()
        calendar = newCal
      }

      if (!calendar) {
        setError('Kein Kalender verfügbar.')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase.from('events').insert({
        ...eventData,
        calendar_id: calendar.id,
        created_by: user.id,
      })

      if (insertError) {
        setError('Fehler beim Speichern.')
        setLoading(false)
        return
      }
    }

    onSaved?.()
    onClose()
    setLoading(false)
  }

  const isEditing = !!editEvent

  return (
    <AnimatePresence>
      {open && (
        <>
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
            className="fixed bottom-0 left-0 right-0 z-50 md:relative md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
          >
            <div className="glass rounded-t-3xl md:rounded-2xl p-6 pb-8 md:pb-6">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5 md:hidden" />

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold text-lg">
                  {isEditing ? 'Event bearbeiten' : 'Neues Event'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-xl px-3 py-2">{error}</p>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <label className="text-white/60 text-sm">Titel</label>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event-Titel"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-3 text-base focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">Ganztägig</span>
                  </div>
                  <button
                    onClick={() => setAllDay(!allDay)}
                    className={`w-11 h-6 rounded-full transition-all relative ${allDay ? 'bg-indigo-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${allDay ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {!allDay ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Von</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Bis</label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-white/40 text-xs mb-1 block">Datum</label>
                    <input
                      type="date"
                      value={startDate.split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value + 'T00:00')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <label className="text-white/60 text-sm">Ort (optional)</label>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Adresse oder Ort"
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlignLeft className="w-4 h-4 text-white/40" />
                    <label className="text-white/60 text-sm">Notiz (optional)</label>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beschreibung..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">Farbe</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!title.trim() || loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Speichern...' : isEditing ? 'Änderungen speichern' : 'Event erstellen'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
