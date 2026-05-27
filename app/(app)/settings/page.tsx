import { Settings, User, Palette, Bell } from 'lucide-react'
import Link from 'next/link'

const settingsSections = [
  {
    icon: User,
    title: 'Profil & Konto',
    description: 'Name, E-Mail, Avatar und Passwort',
    href: '/settings',
  },
  {
    icon: Palette,
    title: 'Erscheinungsbild',
    description: 'Theme, Akzentfarbe, Kalenderansicht',
    href: '/settings/appearance',
  },
  {
    icon: Bell,
    title: 'Benachrichtigungen',
    description: 'Push, E-Mail und In-App Einstellungen',
    href: '/settings/notifications',
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-white font-semibold text-xl">Einstellungen</h1>

      <div className="space-y-3">
        {settingsSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="glass glass-hover rounded-glass-lg p-5 flex items-center gap-4 group"
          >
            <div className="w-10 h-10 bg-indigo-500/20 rounded-glass flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
              <section.icon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">{section.title}</h3>
              <p className="text-white/50 text-sm">{section.description}</p>
            </div>
            <Settings className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/40 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
