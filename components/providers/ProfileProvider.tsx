'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  theme_color: string
  theme_mode: string
  calendar_view: string
  timezone: string
}

interface ProfileContextType {
  profile: Profile | null
  loading: boolean
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const DEFAULT_ACCENT = '#6366f1'

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function applyAccentColor(color: string) {
  const root = document.documentElement
  root.style.setProperty('--accent', color)
  root.style.setProperty('--accent-rgb', hexToRgb(color))
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data)
          applyAccentColor(data.theme_color ?? DEFAULT_ACCENT)
        }
        setLoading(false)
      })
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      setProfile(data)
      if (updates.theme_color) applyAccentColor(updates.theme_color)
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
