'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Save, LogOut, Loader2, Check, Sun, Moon, Monitor } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useTheme } from '@/components/providers/ThemeProvider'

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan', value: '#06b6d4' },
]

export default function SettingsPage() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [accentColor, setAccentColor] = useState('#6366f1')

  useEffect(() => {
    if (user) setName(user.user_metadata?.full_name ?? '')
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: name } })
    await supabase.from('profiles').update({ full_name: name, theme_color: accentColor }).eq('id', user?.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24 md:pb-6">
      <h1 className="text-white font-bold text-xl px-1">Einstellungen</h1>

      {/* Profil */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" /> Profil
        </h2>

        <div>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-white font-medium">{name || 'Kein Name'}</p>
              <p className="text-white/50 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1.5">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white/50 pl-10 pr-4 py-3 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Erscheinungsbild */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold">Erscheinungsbild</h2>

        {/* Theme */}
        <div>
          <label className="text-white/60 text-sm mb-2.5 block">Modus</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Hell', icon: Sun },
              { id: 'dark', label: 'Dunkel', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                  theme === t.id
                    ? 'border-indigo-500/50 bg-indigo-500/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/50'
                }`}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Akzentfarbe */}
        <div>
          <label className="text-white/60 text-sm mb-2.5 block">Akzentfarbe</label>
          <div className="flex gap-2.5 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setAccentColor(c.value)}
                title={c.name}
                className={`w-8 h-8 rounded-full transition-all ${
                  accentColor === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Speichern */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saving ? 'Speichern...' : saved ? 'Gespeichert!' : 'Änderungen speichern'}
      </button>

      {/* Abmelden */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-3.5 rounded-xl transition-all"
      >
        <LogOut className="w-4 h-4" />
        Abmelden
      </button>
    </div>
  )
}
