'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Bell, Settings } from 'lucide-react'

const navigation = [
  { name: 'Kalender', href: '/calendar', icon: Calendar },
  { name: 'Gruppen', href: '/groups', icon: Users },
  { name: 'Glocke', href: '/notifications', icon: Bell },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-glass transition-colors ${
                isActive ? 'text-indigo-400' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
