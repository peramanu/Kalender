import { create } from 'zustand'

type CalendarView = 'month' | 'week' | 'day' | 'agenda'

interface CalendarStore {
  currentDate: Date
  view: CalendarView
  selectedDate: Date | null
  setCurrentDate: (date: Date) => void
  setView: (view: CalendarView) => void
  setSelectedDate: (date: Date | null) => void
  goToToday: () => void
  goToPrev: () => void
  goToNext: () => void
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  view: 'month',
  selectedDate: null,

  setCurrentDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  goToToday: () => set({ currentDate: new Date() }),

  goToPrev: () => {
    const { currentDate, view } = get()
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() - 1)
    else if (view === 'week') d.setDate(d.getDate() - 7)
    else d.setDate(d.getDate() - 1)
    set({ currentDate: d })
  },

  goToNext: () => {
    const { currentDate, view } = get()
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + 1)
    else if (view === 'week') d.setDate(d.getDate() + 7)
    else d.setDate(d.getDate() + 1)
    set({ currentDate: d })
  },
}))
