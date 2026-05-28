'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Save, LogOut, Loader2, Check, Sun, Moon, Monitor, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useProfile } from '@/components/providers/ProfileProvider'
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

const TIMEZONES = [
  'Europe/Berlin', 'Europe/Vienna', 'Europe/Zurich',
  'Europe/London', 'America/New_York', 'America/Los_Angeles',
  'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
]

export default function SettingsPage() {
  const { user } = useUser()
  const { profile, updateProfile } = useProfile()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [name, setName] = useState('')
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [timezone, setTimezone] = useState('Europe/Berlin')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setAccentColor(profile.theme_color ?? '#6366f1')
      setTimezone(profile.timezone ?? 'Europe/Berlin')
    }
    if (user) setName(user.user_metadata?.full_name ?? '')
  }, [profile, user])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.auth.updateUser({ data: { full_name: name } })
    await updateProfile({
      full_name: name,
      theme_color: accentColor,
      theme_mode: theme,
      timezone,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24 md:pb-6">
      <h1 className="text-white font-bold text-xl px-1">Einstellungen</h1>

      {/* Profil */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          Profil
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {initials}
          </div>
          <div>
            <p className="text-white font-medium">{name || 'Kein Name'}</p>
            <p className="text-white/50 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-white/60 text-sm mb-1.5">Anzeigename</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all"
              style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
            />
          </div>
        </div>

        {/* E-Mail (read-only) */}
        <div>
          <label className="block text-white/60 text-sm mb-1.5">E-Mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white/40 pl-10 pr-4 py-3 text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Erscheinungsbild */}
      <div className="glass rounded-2xl p-5 space-y-5">
        <h2 className="text-white font-semibold">Erscheinungsbild</h2>

        {/* Modus */}
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
                  theme === t.id ? 'text-white' : 'border-white/10 bg-white/5 text-white/50'
                }`}
                style={theme === t.id ? {
                  borderColor: `${accentColor}50`,
                  backgroundColor: `${accentColor}20`,
                } : {}}
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
          <div className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setAccentColor(c.value)}
                title={c.name}
                className={`w-9 h-9 rounded-full transition-all relative ${
                  accentColor === c.value ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.value }}
              >
                {accentColor === c.value && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Vorschau */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-white/40 text-xs font-mono">{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Zeitzone */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          Zeitzone
        </h2>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz} className="bg-gray-900">{tz}</option>
          ))}
        </select>
      </div>

      {/* Speichern */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98]"
        style={{ backgroundColor: accentColor }}
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
