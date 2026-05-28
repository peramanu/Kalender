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
  { name: 'Glocke', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
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
                    onClick={() => setModalOpen(true)}
                    className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 active:scale-95 transition-transform -mt-5"
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </button>
                )
              }

              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-white/40'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
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
