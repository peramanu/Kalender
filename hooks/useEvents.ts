'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth } from 'date-fns'
import { useCalendarStore } from '@/store/calendarStore'

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  location: string | null
  color: string | null
  start_at: string
  end_at: string
  all_day: boolean
  status: string
  calendar_id: string
  created_by: string | null
  calendars?: { color: string; name: string }
}

export function useEvents(currentDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const hiddenCalendars = useCalendarStore((state) => state.hiddenCalendars)

  const fetchEvents = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const from = startOfMonth(currentDate).toISOString()
    const to = endOfMonth(currentDate).toISOString()

    const { data } = await supabase
      .from('events')
      .select('*, calendars(color, name)')
      .gte('start_at', from)
      .lte('start_at', to)
      .order('start_at')

    setEvents(data ?? [])
    setLoading(false)
  }, [currentDate])

  useEffect(() => {
    fetchEvents()

    const supabase = createClient()
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchEvents])

  const visibleEvents = hiddenCalendars.size > 0
    ? events.filter((e) => !hiddenCalendars.has(e.calendar_id))
    : events

  return { events: visibleEvents, loading, refetch: fetchEvents }
}
