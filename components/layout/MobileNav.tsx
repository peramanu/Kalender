'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Bell, Settings, Plus } from 'lucide-react'
import { useState } from 'react'
import { EventModal } from '@/components/calendar/EventModal'

const navigation = [
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Gruppen', href: '/groups', icon: Users },
  { name: '', href: '', icon: Plus }, // FAB Platzhalter
  { name: 'Mitteil.', href: '/notifications', icon: Bell },
  { name: 'Profil', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Glass Bar */}
        <div className="glass border-t border-white/10 pb-safe">
          <div className="flex items-center justify-around h-16 px-2">
            {navigation.map((item, idx) => {
              // Mittlerer FAB
              if (idx === 2) {
                return (
                  <button
                    key="fab"
                    aria-label="Neues Event"
                    onClick={() => setModalOpen(true)}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform -mt-6"
                    style={{
                      backgroundColor: 'var(--accent)',
                      boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.45)',
                    }}
                  >
                    <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </button>
                )
              }

              const isActive =
                item.href === '/calendar'
                  ? pathname === '/calendar' || pathname?.startsWith('/calendar')
                  : pathname?.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 flex-1 h-full active:scale-90 transition-transform"
                  style={{ color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.4)' }}
                >
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium leading-none">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
