'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, Calendar, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

const typeIcon = (type: string) => {
  if (type.includes('invite') || type.includes('group')) return <Users className="w-4 h-4" />
  return <Calendar className="w-4 h-4" />
}

export default function NotificationsPage() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifications(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const markAllRead = async () => {
    if (!user) return
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-lg mx-auto space-y-3 pb-24 md:pb-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-white font-bold text-xl">Benachrichtigungen</h1>
          {unread > 0 && <p className="text-indigo-400 text-sm">{unread} ungelesen</p>}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-xl transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Alle lesen
          </button>
        )}
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-white font-semibold">Alles erledigt</p>
          <p className="text-white/50 text-sm mt-1">Keine neuen Benachrichtigungen.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`glass rounded-2xl p-4 flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-all ${
                !n.read ? 'border border-indigo-500/20' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                !n.read ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'
              }`}>
                {typeIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${!n.read ? 'text-white' : 'text-white/60'}`}>
                  {n.title}
                </p>
                {n.body && <p className="text-white/50 text-xs mt-0.5 line-clamp-2">{n.body}</p>}
                <p className="text-white/30 text-xs mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: de })}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
