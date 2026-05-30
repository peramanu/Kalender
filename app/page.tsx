import Link from 'next/link'
import {
  Calendar, Users, Bell, Zap, Shield, Palette,
  Check, X, ArrowRight, Clock, Star, Globe,
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Alle Ansichten',
    description: 'Monat, Woche, Tag, Agenda — flüssig wechseln, nie den Überblick verlieren.',
    accent: '#6366f1',
  },
  {
    icon: Users,
    title: 'Gruppenkalender',
    description: 'Teams, Familien, Freundeskreise — mit Rollen, Einladungen und Live-Sync.',
    accent: '#8b5cf6',
  },
  {
    icon: Zap,
    title: 'Echtzeit-Sync',
    description: 'Änderungen sind sofort für alle sichtbar. Kein Neuladen, kein Warten.',
    accent: '#f59e0b',
  },
  {
    icon: Bell,
    title: 'Smarte Erinnerungen',
    description: 'Web Push, E-Mail und In-App — genau dann, wenn du sie brauchst.',
    accent: '#10b981',
  },
  {
    icon: Shield,
    title: 'Sicher & Privat',
    description: 'Row Level Security. Jeder sieht nur, was er sehen darf.',
    accent: '#06b6d4',
  },
  {
    icon: Palette,
    title: 'Vollständig personalisierbar',
    description: 'Akzentfarbe, Dark Mode, Zeitzone — dein Kalender, dein Stil.',
    accent: '#ec4899',
  },
]

const comparison = [
  {
    feature: 'Liquid Glass Design',
    us: true,
    google: false,
    notion: false,
  },
  {
    feature: 'Gruppenrollen (Owner, Admin, Mitglied)',
    us: true,
    google: 'begrenzt',
    notion: false,
  },
  {
    feature: 'Echtzeit-Kollaboration',
    us: true,
    google: false,
    notion: false,
  },
  {
    feature: 'Framer Motion Animationen',
    us: true,
    google: false,
    notion: false,
  },
  {
    feature: 'Web Push Notifications',
    us: true,
    google: true,
    notion: false,
  },
  {
    feature: 'RSVP für Events',
    us: true,
    google: true,
    notion: false,
  },
  {
    feature: 'Akzentfarbe & Dark Mode',
    us: true,
    google: 'begrenzt',
    notion: true,
  },
]

function CompareCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-white/20 mx-auto" />
  return <span className="text-white/40 text-xs">{value}</span>
}

const stats = [
  { value: '4', label: 'Kalender-Ansichten' },
  { value: '∞', label: 'Gruppen & Kalender' },
  { value: '100%', label: 'Kostenlos starten' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-purple-700/20 rounded-full blur-[80px]" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06]" style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(10,10,30,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Kalender</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-white/50 hover:text-white text-sm transition-colors">Features</a>
            <a href="#vergleich" className="text-white/50 hover:text-white text-sm transition-colors">Vergleich</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-white/60 hover:text-white text-sm transition-colors px-4 py-2"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center relative">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 rounded-full text-sm text-indigo-300 mb-8">
          <Star className="w-3.5 h-3.5 fill-indigo-400" />
          Jetzt mit Echtzeit-Sync & Gruppenkalender
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.92] tracking-tighter mb-8">
          Der Kalender,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #c084fc 40%, #f472b6 100%)' }}
          >
            den du verdienst.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Schöner als Google Calendar. Mächtiger als Notion.
          <br />
          Mit Liquid Glass Design und Echtzeit-Kollaboration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Kostenlos starten
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            Demo ansehen
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 justify-center mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* App Preview */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div
          className="rounded-glass-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          {/* Fake browser chrome */}
          <div className="border-b border-white/10 px-5 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 max-w-xs mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-center text-white/30 text-xs">
                kalender.app
              </div>
            </div>
          </div>
          {/* App mockup content */}
          <div className="p-6 min-h-[360px] flex">
            {/* Fake sidebar */}
            <div className="hidden md:flex w-48 flex-col gap-3 pr-6 border-r border-white/10 mr-6 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white text-sm font-semibold">Kalender</span>
              </div>
              {['Kalender', 'Gruppen', 'Benachrichtigungen', 'Einstellungen'].map((item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-xl text-xs font-medium ${i === 0 ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/30'}`}
                >
                  {item}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/20 text-[10px] uppercase tracking-widest mb-3">Meine Kalender</p>
                {[
                  { name: 'Persönlich', color: '#6366f1' },
                  { name: 'Arbeit', color: '#10b981' },
                  { name: 'Familie', color: '#f59e0b' },
                ].map((cal) => (
                  <div key={cal.name} className="flex items-center gap-2 py-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cal.color }} />
                    <span className="text-white/40 text-xs">{cal.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fake calendar grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">Mai 2026</span>
                <div className="flex gap-1">
                  {['M', 'W', 'T', 'A'].map((v) => (
                    <div key={v} className={`text-xs px-2 py-1 rounded-lg ${v === 'M' ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/30'}`}>{v}</div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
                  <div key={d} className="text-center text-[10px] text-white/20 pb-2">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2
                  const isToday = day === 21
                  const hasEvent = [3, 7, 10, 14, 17, 21, 24, 28].includes(day)
                  const eventColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
                  return (
                    <div key={i} className="aspect-square flex flex-col items-center justify-start pt-1 rounded-lg relative">
                      {day > 0 && day <= 31 && (
                        <>
                          <span
                            className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-500 text-white font-bold' : 'text-white/50'}`}
                          >
                            {day}
                          </span>
                          {hasEvent && (
                            <div
                              className="w-1 h-1 rounded-full mt-0.5"
                              style={{ backgroundColor: eventColors[day % 4] }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Alles was du brauchst
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Jedes Feature durchdacht. Jede Interaktion flüssig.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-glass-lg p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden"
              style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              {/* Accent glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-glass-lg"
                style={{ background: `radial-gradient(circle at top left, ${feature.accent}15, transparent 60%)` }}
              />
              <div
                className="relative w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.accent}18`, border: `1px solid ${feature.accent}30` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
              </div>
              <h3 className="relative font-bold text-white mb-2">{feature.title}</h3>
              <p className="relative text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section id="vergleich" className="max-w-4xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Vergleich</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Der Unterschied
          </h2>
          <p className="text-white/40 text-lg">Was uns von der Konkurrenz abhebt.</p>
        </div>

        <div
          className="rounded-glass-xl overflow-hidden border border-white/[0.08]"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-white/10">
            <div className="p-4" />
            <div className="p-4 text-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-indigo-500/40">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-bold text-sm">Kalender</p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Globe className="w-4 h-4 text-white/50" />
              </div>
              <p className="text-white/40 text-sm">Google</p>
            </div>
            <div className="p-4 text-center border-l border-white/10">
              <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Clock className="w-4 h-4 text-white/50" />
              </div>
              <p className="text-white/40 text-sm">Notion</p>
            </div>
          </div>

          {/* Rows */}
          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 border-b border-white/[0.06] ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
            >
              <div className="p-4 text-white/70 text-sm">{row.feature}</div>
              <div className="p-4 flex items-center justify-center">
                <CompareCell value={row.us} />
              </div>
              <div className="p-4 flex items-center justify-center border-l border-white/[0.06]">
                <CompareCell value={row.google} />
              </div>
              <div className="p-4 flex items-center justify-center border-l border-white/[0.06]">
                <CompareCell value={row.notion} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-32">
        <div
          className="relative rounded-glass-xl p-12 md:p-16 text-center overflow-hidden border border-white/[0.08]"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(99,102,241,0.08)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Jetzt starten</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Bereit loszulegen?
            </h2>
            <p className="text-white/50 mb-10 text-lg">
              Kostenlos starten — keine Kreditkarte, kein Risiko.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Jetzt kostenlos registrieren
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white/60 font-semibold text-sm">Kalender</span>
          </div>
          <p className="text-white/25 text-sm">
            © {new Date().getFullYear()} Kalender. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-white/30 hover:text-white/60 text-sm transition-colors">Anmelden</Link>
            <Link href="/register" className="text-white/30 hover:text-white/60 text-sm transition-colors">Registrieren</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
