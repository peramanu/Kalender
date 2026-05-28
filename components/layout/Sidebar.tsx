'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Calendar, Users, Bell, Settings, ChevronLeft, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { MiniCalendar } from '@/components/calendar/MiniCalendar'

const navigation = [
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Gruppen', href: '/groups', icon: Users },
  { name: 'Mitteilungen', href: '/notifications', icon: Bell },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
]

interface CalendarItem {
  id: string
  name: string
  color: string
  type: string
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useUser()
  const [calendars, setCalendars] = useState<CalendarItem[]>([])
  const [hiddenCalendars, setHiddenCalendars] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('calendars')
      .select('id, name, color, type')
      .eq('owner_id', user.id)
      .then(({ data }) => setCalendars(data ?? []))
  }, [user])

  const toggleCalendar = (id: string) => {
    setHiddenCalendars((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className={`hidden md:flex flex-col glass border-r border-white/10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-semibold text-white">Kalender</span>}
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        {/* Mini-Kalender */}
        {!collapsed && (
          <div className="border-b border-white/10">
            <MiniCalendar />
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`}
                style={isActive ? { backgroundColor: 'var(--accent, #6366f1)25', color: 'white' } : {}}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" style={isActive ? { color: 'var(--accent)' } : {}} />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* Kalender-Switcher */}
        {!collapsed && calendars.length > 0 && (
          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-2.5">Meine Kalender</p>
            <div className="space-y-1.5">
              {calendars.map((cal) => {
                const isHidden = hiddenCalendars.has(cal.id)
                return (
                  <button
                    key={cal.id}
                    onClick={() => toggleCalendar(cal.id)}
                    className="w-full flex items-center gap-2.5 px-1 py-1 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 border-2 transition-all ${isHidden ? 'bg-transparent' : ''}`}
                      style={{
                        borderColor: cal.color,
                        backgroundColor: isHidden ? 'transparent' : cal.color,
                      }}
                    />
                    <span className={`text-sm transition-colors ${isHidden ? 'text-white/30' : 'text-white/70 group-hover:text-white'}`}>
                      {cal.name}
                    </span>
                    {cal.type === 'group' && (
                      <Users className="w-3 h-3 text-white/20 ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 flex-shrink-0 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.user_metadata?.full_name ?? 'Benutzer'}
              </p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Abmelden' : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Abmelden'}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 text-white/20 hover:text-white/50 transition-colors rounded-xl hover:bg-white/5"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  )
}
