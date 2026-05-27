import { Users, Plus } from 'lucide-react'
import Link from 'next/link'

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-semibold text-xl">Gruppen</h1>
        <Link
          href="/groups/new"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-glass transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Gruppe erstellen
        </Link>
      </div>

      {/* Empty State */}
      <div className="glass rounded-glass-xl p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-glass-xl flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-white font-semibold text-lg mb-2">Noch keine Gruppen</h2>
        <p className="text-white/50 text-sm max-w-xs mb-6">
          Erstelle eine Gruppe für dein Team, deine Familie oder Freunde — und plant gemeinsam.
        </p>
        <Link
          href="/groups/new"
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-6 py-2.5 rounded-glass transition-all hover:scale-105"
        >
          Erste Gruppe erstellen
        </Link>
      </div>
    </div>
  )
}
