import Link from 'next/link'
import { Calendar, Users, Bell, Zap, Shield, Palette } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Alle Ansichten',
    description: 'Monat, Woche, Tag, Agenda — mit flüssigen Übergängen zwischen den Ansichten.',
  },
  {
    icon: Users,
    title: 'Gruppenkalender',
    description: 'Teams, Familien, Freundeskreise — Rollen, Einladungen und Realtime-Sync.',
  },
  {
    icon: Bell,
    title: 'Smarte Benachrichtigungen',
    description: 'Web Push, E-Mail und In-App — konfigurierbar pro Event-Typ.',
  },
  {
    icon: Zap,
    title: 'Realtime Sync',
    description: 'Änderungen sehen alle Mitglieder sofort — dank Supabase Realtime.',
  },
  {
    icon: Shield,
    title: 'Sicher & Privat',
    description: 'Row Level Security — jeder sieht nur, was er sehen darf.',
  },
  {
    icon: Palette,
    title: 'Vollständig personalisierbar',
    description: 'Akzentfarbe, Dark Mode, Timezone — dein Kalender, dein Stil.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-glass flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">Kalender</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-glass transition-colors"
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/80 mb-8">
          <Zap className="w-4 h-4 text-indigo-400" />
          Jetzt mit Realtime-Sync & Gruppenkalender
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Der Kalender,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            den du verdienst.
          </span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Schöner als Google Calendar. Mächtiger als Notion. Mit Liquid Glass Design,
          Gruppenfeatures und Echtzeit-Synchronisation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-glass-lg text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Kostenlos starten →
          </Link>
          <Link
            href="/calendar"
            className="glass glass-hover text-white font-semibold px-8 py-4 rounded-glass-lg text-lg"
          >
            Demo ansehen
          </Link>
        </div>
      </section>

      {/* App Preview Mockup */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="glass rounded-glass-xl p-1 shadow-2xl shadow-black/30">
          <div className="glass-dark rounded-[20px] h-80 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-white/50 text-sm">App Preview — Kommt bald</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Alles was du brauchst
        </h2>
        <p className="text-white/50 text-center mb-12">
          Jedes Feature durchdacht. Jede Interaktion flüssig.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass glass-hover rounded-glass-lg p-6 group"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-glass flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                <feature.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="glass rounded-glass-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit loszulegen?
          </h2>
          <p className="text-white/60 mb-8">
            Kostenlos starten — kein Kreditkarte, kein Risiko.
          </p>
          <Link
            href="/register"
            className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-10 py-4 rounded-glass-lg text-lg transition-all hover:scale-105"
          >
            Jetzt kostenlos registrieren
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-white/50 text-sm">Kalender App</span>
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Kalender. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </main>
  )
}
