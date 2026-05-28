'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Plus, Calendar, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface Group {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  type: string
}

export default function GroupsPage() {
  const { user } = useUser()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('calendars')
      .select('*')
      .eq('type', 'group')
      .then(({ data }) => {
        setGroups(data ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24 md:pb-6">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-white font-bold text-xl">Gruppen</h1>
        <Link
          href="/groups/new"
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Neu
        </Link>
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : groups.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Noch keine Gruppen</h2>
          <p className="text-white/50 text-sm max-w-xs mb-6">
            Plane gemeinsam mit Team, Familie oder Freunden.
          </p>
          <Link
            href="/groups/new"
            className="bg-indigo-500 text-white text-sm font-medium px-6 py-3 rounded-xl"
          >
            Erste Gruppe erstellen
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${group.color}30` }}
              >
                <Calendar className="w-6 h-6" style={{ color: group.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{group.name}</p>
                {group.description && (
                  <p className="text-white/50 text-sm truncate">{group.description}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
