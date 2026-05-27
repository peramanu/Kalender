import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <CalendarHeader />
      <CalendarGrid />
    </div>
  )
}
