import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-white font-semibold text-xl">Benachrichtigungen</h1>

      <div className="glass rounded-glass-xl p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-glass-xl flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">Alles erledigt</h2>
        <p className="text-white/50 text-sm">Keine neuen Benachrichtigungen.</p>
      </div>
    </div>
  )
}
