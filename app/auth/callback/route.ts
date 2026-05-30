import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/calendar'

  if (error) {
    const params = new URLSearchParams({ error: errorDescription ?? error })
    return NextResponse.redirect(`${origin}/login?${params}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      const params = new URLSearchParams({ error: 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.' })
      return NextResponse.redirect(`${origin}/login?${params}`)
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login`)
}
