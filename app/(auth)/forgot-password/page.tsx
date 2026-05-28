'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) {
      setError('Fehler beim Senden. Bitte versuche es erneut.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col justify-center px-5 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm mx-auto">
        <Link href="/login" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Passwort vergessen</h1>
          <p className="text-white/50 text-sm mt-1">Wir schicken dir einen Reset-Link</p>
        </div>

        {sent ? (
          <div className="glass rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h2 className="text-white font-semibold mb-2">E-Mail gesendet!</h2>
            <p className="text-white/60 text-sm">
              Schau in dein Postfach bei <strong>{email}</strong> und klicke auf den Link.
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-1.5">E-Mail</label>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                {loading ? 'Senden...' : 'Reset-Link senden'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
