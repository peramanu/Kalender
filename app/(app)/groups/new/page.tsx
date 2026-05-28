'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#10b981', '#06b6d4',
]

export default function NewGroupPage() {
  const router = useRouter()
  const { user } = useUser()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!name.trim() || !user) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('calendars')
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        color,
        type: 'group',
        owner_id: user.id,
      })
      .select()
      .single()

    if (err || !data) {
      setError('Fehler beim Erstellen der Gruppe.')
      setLoading(false)
      return
    }

    // Ersteller auch als Mitglied eintragen
    await supabase.from('calendar_members').insert({
      calendar_id: data.id,
      user_id: user.id,
      role: 'owner',
    })

    router.push(`/groups/${data.id}`)
  }

  return (
    <div className="max-w-lg mx-auto pb-24 md:pb-6">
      {/* Back */}
      <Link
        href="/groups"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-5 px-1"
      >
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>

      <h1 className="text-white font-bold text-xl mb-4 px-1">Gruppe erstellen</h1>

      <div className="glass rounded-2xl p-5 space-y-4">
        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-xl px-3 py-2">{error}</p>
        )}

        {/* Name */}
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Gruppenname *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Familie Müller"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-3 text-base focus:outline-none focus:border-indigo-400/50 transition-all"
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Beschreibung (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Worum geht es in dieser Gruppe?"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 transition-all resize-none"
          />
        </div>

        {/* Farbe */}
        <div>
          <label className="block text-white/60 text-sm mb-2">Gruppenfarbe</label>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Vorschau */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}40` }}>
            <span className="text-lg">{name[0] ?? '?'}</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{name || 'Gruppenname'}</p>
            <p className="text-white/50 text-xs">{description || 'Keine Beschreibung'}</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Erstellen...' : 'Gruppe erstellen'}
        </button>
      </div>
    </div>
  )
}
