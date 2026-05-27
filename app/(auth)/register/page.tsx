'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Supabase Auth Register
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-glass-lg mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Konto erstellen</h1>
          <p className="text-white/50 text-sm mt-1">Kostenlos — kein Kreditkarte nötig</p>
        </div>

        <div className="glass rounded-glass-xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Max Mustermann"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-glass text-white placeholder-white/30 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@beispiel.de"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-glass text-white placeholder-white/30 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 Zeichen"
                  minLength={8}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-glass text-white placeholder-white/30 pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-indigo-400/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-glass transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-white/30 text-xs text-center mt-4">
            Mit der Registrierung stimmst du den{' '}
            <span className="text-white/50">Nutzungsbedingungen</span> zu.
          </p>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          Bereits ein Konto?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  )
}
