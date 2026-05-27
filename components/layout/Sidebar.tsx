'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Bell, Settings, Plus, ChevronLeft } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Gruppen', href: '/groups', icon: Users },
  { name: 'Benachrichtigungen', href: '/notifications', icon: Bell },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden md:flex flex-col glass border-r border-white/10 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-glass flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-white text-lg">Kalender</span>
          )}
        </div>
      </div>

      {/* New Event Button */}
      <div className="p-3">
        <button
          className={`w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-glass py-2.5 flex items-center gap-2 transition-all hover:scale-[1.02] ${
            collapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Neues Event</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-glass text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>

      {/* Calendars List */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">
            Meine Kalender
          </p>
          <div className="space-y-2">
            {[
              { name: 'Persönlich', color: '#6366f1' },
              { name: 'Arbeit', color: '#10b981' },
              { name: 'Familie', color: '#f59e0b' },
            ].map((cal) => (
              <div key={cal.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cal.color }}
                />
                <span className="text-white/60 text-sm hover:text-white cursor-pointer transition-colors">
                  {cal.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-white/30 hover:text-white/70 transition-colors rounded-glass hover:bg-white/5"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  )
}
