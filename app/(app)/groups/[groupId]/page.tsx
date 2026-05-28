'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, Mail, Plus, Crown, Shield, User, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface Group {
  id: string
  name: string
  description: string | null
  color: string
  owner_id: string
}

interface Member {
  id: string
  role: string
  joined_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
  user_id: string
}

const roleIcon = (role: string) => {
  if (role === 'owner') return <Crown className="w-3 h-3 text-yellow-400" />
  if (role === 'admin') return <Shield className="w-3 h-3 text-blue-400" />
  return <User className="w-3 h-3 text-white/40" />
}

const roleLabel = (role: string) => {
  if (role === 'owner') return 'Besitzer'
  if (role === 'admin') return 'Admin'
  if (role === 'viewer') return 'Betrachter'
  return 'Mitglied'
}

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const router = useRouter()
  const { user } = useUser()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('calendars').select('*').eq('id', groupId).single(),
      supabase.from('calendar_members').select('*, profiles(full_name, avatar_url)').eq('calendar_id', groupId),
    ]).then(([{ data: g }, { data: m }]) => {
      setGroup(g)
      setMembers(m ?? [])
      setLoading(false)
    })
  }, [groupId])

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !user || !group) return
    setInviting(true)
    const supabase = createClient()
    await supabase.from('calendar_invites').insert({
      calendar_id: group.id,
      invited_by: user.id,
      email: inviteEmail.trim(),
      role: 'member',
    })
    setInviteEmail('')
    setInviteSent(true)
    setInviting(false)
    setTimeout(() => setInviteSent(false), 3000)
  }

  const isOwner = group?.owner_id === user?.id

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!group) return (
    <div className="text-center text-white/50 mt-20">Gruppe nicht gefunden.</div>
  )

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24 md:pb-6">
      {/* Back */}
      <Link href="/groups" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm px-1">
        <ArrowLeft className="w-4 h-4" /> Gruppen
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ backgroundColor: `${group.color}40` }}
          >
            {group.name[0]}
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{group.name}</h1>
            {group.description && (
              <p className="text-white/50 text-sm mt-0.5">{group.description}</p>
            )}
            <p className="text-white/30 text-xs mt-1">{members.length} Mitglied{members.length !== 1 ? 'er' : ''}</p>
          </div>
        </div>
      </div>

      {/* Mitglieder einladen */}
      {isOwner && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            Mitglied einladen
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="E-Mail-Adresse"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400/50 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            />
            <button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || inviting}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 flex items-center gap-1.5"
              style={{ backgroundColor: group.color }}
            >
              <Plus className="w-4 h-4" />
              {inviting ? '...' : 'Einladen'}
            </button>
          </div>
          {inviteSent && (
            <p className="text-green-400 text-sm">✓ Einladung gesendet!</p>
          )}
        </div>
      )}

      {/* Mitgliederliste */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Mitglieder
        </h2>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: `${group.color}60` }}
              >
                {member.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {member.profiles?.full_name ?? 'Unbekannt'}
                </p>
                <div className="flex items-center gap-1">
                  {roleIcon(member.role)}
                  <span className="text-white/40 text-xs">{roleLabel(member.role)}</span>
                </div>
              </div>
              {isOwner && member.user_id !== user?.id && (
                <button className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
