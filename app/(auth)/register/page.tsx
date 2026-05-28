'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Diese E-Mail ist bereits registriert.')
      } else {
        setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.')
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col justify-center px-5 py-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        </div>
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">E-Mail bestätigen</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Wir haben dir eine E-Mail an <span className="text-white font-medium">{email}</span> geschickt.
            Klicke auf den Link um dein Konto zu aktivieren.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl"
          >
            Zur Anmeldung
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-5 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Konto erstellen</h1>
          <p className="text-white/50 text-sm mt-1">Kostenlos — kein Kreditkarte nötig</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 pl-10 pr-4 py-3.5 text-base focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@beispiel.de"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 pl-10 pr-4 py-3.5 text-base focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 Zeichen"
                  minLength={8}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 pl-10 pr-12 py-3.5 text-base focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all text-base mt-2"
            >
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-white/30 text-xs text-center mt-4">
            Mit der Registrierung stimmst du den Nutzungsbedingungen zu.
          </p>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          Bereits ein Konto?{' '}
          <Link href="/login" className="text-indigo-400 font-medium">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  )
}
