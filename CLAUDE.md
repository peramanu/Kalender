# Kalender App — Projektkontext für Claude Code

## Projektübersicht

Eine moderne, feature-reiche Kalender-Web-App die besser als Google Calendar, Notion Calendar und Apple Calendar sein soll. Zielgruppe: Teams, Familien, Freundeskreise. Fokus auf herausragendes Design (Liquid Glass / iOS 26 Ästhetik), Gruppenfeatures und starke Personalisierung.

**Projektziel:** Die beste Kalender-App die es gibt — designtechnisch, funktional und UX-seitig.

---

## Tech Stack (festgelegt)

| Schicht | Technologie | Begründung |
|---|---|---|
| Frontend Framework | **Next.js 14+ (App Router)** | SSR, optimale Vercel-Integration, React Server Components |
| Styling | **Tailwind CSS v3** | Utility-first, perfekt für Custom Design System |
| Animationen | **Framer Motion** | Liquid Glass Effekte, Page Transitions, Micro-Interactions |
| Backend / DB | **Supabase** | PostgreSQL, Auth, Realtime, Storage, Edge Functions — alles in einem |
| Auth | **Supabase Auth** | E-Mail/Passwort, OAuth (Google, GitHub), Magic Links |
| E-Mails | **Resend** | Transaktions-E-Mails (Einladungen, Passwort-Reset, Erinnerungen) |
| Deployment | **Vercel** | Git-Push Deploy, Preview URLs, globales CDN |
| Domain | **Cloudflare Registrar** | At-cost Preise, DNS, DDoS-Schutz, CDN |
| Sprache | **TypeScript** (strict mode) | Überall — Frontend und API Routes |
| State Management | **Zustand** | Leichtgewichtig, kein Redux-Overhead |
| Kalender-Logik | **date-fns** | Tree-shakeable, keine Heavy-Dependencies |
| Icons | **Lucide React** | Konsistentes Icon-Set |

---

## Design System — Liquid Glass / iOS 26

### Kernprinzipien
- **Glassmorphismus:** `backdrop-filter: blur(20px)`, semi-transparente Surfaces
- **Weiche Übergänge:** Alle Animationen 200–400ms, `ease-in-out` oder Spring-Physik
- **Tiefe:** Mehrere Layer mit unterschiedlicher Transparenz erzeugen Depth
- **Dark Mode:** Nativ unterstützt, alle Komponenten dual-mode
- **Mobile-first:** Touch-Gesten (swipe, pinch-to-zoom im Kalender)

### Design Tokens (Tailwind Config)
```js
// tailwind.config.ts
colors: {
  glass: {
    white: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
    border: 'rgba(255, 255, 255, 0.2)',
  }
},
backdropBlur: {
  glass: '20px',
  'glass-lg': '40px',
},
borderRadius: {
  'glass': '16px',
  'glass-lg': '24px',
  'glass-xl': '32px',
}
```

### Typische Glass-Komponente
```tsx
// Beispiel Modal / Card
<div className="
  bg-white/10 dark:bg-black/20
  backdrop-blur-glass
  border border-white/20
  rounded-glass-lg
  shadow-lg shadow-black/10
  p-6
">
```

---

## Datenbankschema (Supabase / PostgreSQL)

```sql
-- Users (erweitert Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  theme_color TEXT DEFAULT '#6366f1',        -- persönliche Akzentfarbe
  theme_mode TEXT DEFAULT 'system',           -- 'light' | 'dark' | 'system'
  calendar_view TEXT DEFAULT 'month',         -- 'day' | 'week' | 'month' | 'agenda'
  notification_email BOOLEAN DEFAULT true,
  notification_push BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'Europe/Berlin',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kalender (persönlich oder Gruppe)
CREATE TABLE calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6366f1',      -- Hex-Farbe
  icon TEXT DEFAULT 'calendar',               -- Lucide Icon Name
  type TEXT NOT NULL DEFAULT 'personal',      -- 'personal' | 'group'
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gruppen-Mitgliedschaften
CREATE TABLE calendar_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',        -- 'owner' | 'admin' | 'member' | 'viewer'
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(calendar_id, user_id)
);

-- Einladungen
CREATE TABLE calendar_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES profiles(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  accepted BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ DEFAULT now() + interval '7 days',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  color TEXT,                                 -- überschreibt Kalenderfarbe wenn gesetzt
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  recurrence_rule TEXT,                       -- RRULE string (RFC 5545)
  recurrence_end TIMESTAMPTZ,
  status TEXT DEFAULT 'confirmed',            -- 'confirmed' | 'tentative' | 'cancelled'
  visibility TEXT DEFAULT 'default',          -- 'default' | 'public' | 'private'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event-Teilnehmer / RSVPs
CREATE TABLE event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp TEXT DEFAULT 'pending',               -- 'accepted' | 'declined' | 'tentative' | 'pending'
  UNIQUE(event_id, user_id)
);

-- Benachrichtigungen
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                         -- 'event_reminder' | 'invite' | 'event_update' | 'rsvp'
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,                                -- Extra-Daten (event_id, calendar_id etc.)
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Push-Subscriptions (Web Push / PWA)
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) aktivieren auf allen Tabellen
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

---

## Projektstruktur (Next.js App Router)

```
kalender/
├── CLAUDE.md                          ← diese Datei
├── README.md
├── .env.local                         ← nie committen!
├── .env.example                       ← committen (ohne Werte)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── app/
│   ├── layout.tsx                     ← Root Layout, Theme Provider
│   ├── page.tsx                       ← Landing Page / Marketing
│   ├── globals.css                    ← Tailwind + CSS Variables
│   │
│   ├── (auth)/                        ← Auth-Gruppe (kein Layout-Wrapper)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── callback/route.ts          ← Supabase OAuth Callback
│   │
│   ├── (app)/                         ← App-Gruppe (mit Sidebar Layout)
│   │   ├── layout.tsx                 ← App Shell: Sidebar + Header
│   │   ├── calendar/
│   │   │   ├── page.tsx               ← Haupt-Kalenderansicht
│   │   │   ├── [eventId]/page.tsx     ← Event-Detail
│   │   │   └── new/page.tsx           ← Neues Event erstellen
│   │   ├── groups/
│   │   │   ├── page.tsx               ← Gruppen-Übersicht
│   │   │   ├── new/page.tsx           ← Gruppe erstellen
│   │   │   └── [groupId]/
│   │   │       ├── page.tsx           ← Gruppen-Kalender
│   │   │       └── settings/page.tsx  ← Gruppen-Einstellungen
│   │   ├── settings/
│   │   │   ├── page.tsx               ← Profil & Konto
│   │   │   ├── appearance/page.tsx    ← Theme, Farben, Kalenderfarben
│   │   │   └── notifications/page.tsx ← Benachrichtigungs-Einstellungen
│   │   └── notifications/page.tsx     ← Benachrichtigungs-Center
│   │
│   └── api/
│       ├── webhooks/
│       │   └── resend/route.ts        ← E-Mail Webhooks
│       └── notifications/
│           └── push/route.ts          ← Web Push senden
│
├── components/
│   ├── ui/                            ← Basis-Komponenten (Button, Input, Modal...)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   └── toast.tsx
│   ├── calendar/                      ← Kalender-spezifische Komponenten
│   │   ├── CalendarGrid.tsx           ← Monat/Woche/Tag Grid
│   │   ├── CalendarHeader.tsx         ← Navigation (Heute, Vor, Zurück, Ansicht)
│   │   ├── EventCard.tsx              ← Event-Kachel im Grid
│   │   ├── EventModal.tsx             ← Event erstellen/bearbeiten
│   │   ├── MiniCalendar.tsx           ← Kleiner Kalender in Sidebar
│   │   └── CalendarSwitcher.tsx       ← Kalender ein/ausblenden mit Farben
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── InviteMemberModal.tsx
│   │   └── MemberList.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx                ← Linke Sidebar
│   │   ├── Header.tsx                 ← Top Header
│   │   └── MobileNav.tsx              ← Bottom Nav für Mobile
│   └── providers/
│       ├── SupabaseProvider.tsx        ← Supabase Client Context
│       ├── ThemeProvider.tsx           ← Dark/Light Mode
│       └── CalendarProvider.tsx        ← Kalender-State (Zustand)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  ← Browser Supabase Client
│   │   ├── server.ts                  ← Server Supabase Client (für Server Components)
│   │   └── middleware.ts              ← Auth-Middleware
│   ├── calendar/
│   │   ├── utils.ts                   ← Datum-Hilfsfunktionen mit date-fns
│   │   ├── recurrence.ts              ← RRULE Parser/Generator
│   │   └── colors.ts                  ← Kalenderfarben-Palette
│   ├── notifications/
│   │   ├── push.ts                    ← Web Push Logik
│   │   └── email.ts                   ← Resend E-Mail Templates
│   └── types/
│       └── database.ts                ← Supabase generierte Types (supabase gen types)
│
├── hooks/
│   ├── useCalendar.ts                 ← Kalender-State, View-Wechsel
│   ├── useEvents.ts                   ← Events laden, erstellen, updaten
│   ├── useGroups.ts                   ← Gruppen-Operationen
│   ├── useNotifications.ts            ← Benachrichtigungen
│   └── useUser.ts                     ← Auth-State
│
├── store/
│   └── calendarStore.ts               ← Zustand Store (aktuelles Datum, Ansicht, sichtbare Kalender)
│
└── supabase/
    ├── migrations/                    ← SQL Migrations (auto-generiert)
    └── seed.sql                       ← Testdaten für Development
```

---

## Umgebungsvariablen (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # nur server-seitig, nie im Client!

# Resend (E-Mails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@deinedomain.com

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:hello@deinedomain.com

# App
NEXT_PUBLIC_APP_URL=https://deinedomain.com
```

---

## GitHub Workflow

### Repository Setup
```bash
# Im Projektordner C:\Projekte\Kalender
git init
git remote add origin https://github.com/DEIN-USERNAME/kalender.git
git branch -M main
```

### Branch-Strategie
```
main          ← Production (Vercel deployed automatisch)
develop       ← Integration Branch
feature/*     ← Feature Branches (z.B. feature/group-calendar)
fix/*         ← Bugfix Branches
```

### Typischer Workflow
```bash
git checkout -b feature/event-creation
# ... Code schreiben ...
git add .
git commit -m "feat: add event creation modal with recurrence support"
git push origin feature/event-creation
# Pull Request auf GitHub → merge in develop → merge in main → auto-deploy Vercel
```

### Commit-Konventionen (Conventional Commits)
```
feat:     neues Feature
fix:      Bugfix
design:   UI/Design Änderungen
refactor: Code-Umstrukturierung
perf:     Performance-Verbesserung
docs:     Dokumentation
chore:    Dependencies, Config
```

---

## Kernfeatures im Detail

### 1. Gruppenkalender
- Gruppen haben Owner, Admins, Members, Viewers
- Jedes Mitglied sieht den Gruppenkalender überlagert mit eigenem Kalender
- Events können von Members (je nach Berechtigung) erstellt werden
- Einladung per E-Mail (Token-basiert über `calendar_invites`)
- Gruppen haben eigene Farbe + Icon zur Unterscheidung

### 2. Persönlicher Kalender
- Jeder User hat automatisch einen persönlichen Kalender bei Registrierung
- Private Events (nur für den User sichtbar)
- Mehrere persönliche Kalender möglich (z.B. "Arbeit", "Privat", "Sport")

### 3. Event-System
- Eintägige und mehrtägige Events
- Ganztägige Events (all_day flag)
- Wiederkehrende Events (RRULE — täglich, wöchentlich, monatlich, jährlich, custom)
- Farbe pro Event (überschreibt Kalenderfarbe)
- Location (Text, optional Google Maps Link)
- RSVP für Gruppen-Events (Zusagen, Absagen, Vielleicht)
- Event-Status: Bestätigt, Vorläufig, Abgesagt

### 4. Kalender-Ansichten
- Monatsansicht (Standard)
- Wochenansicht
- Tagesansicht
- Agenda/Liste Ansicht
- Ansichts-Wechsel mit Framer Motion Transition

### 5. Personalisierung
- Akzentfarbe pro User (primäre UI-Farbe)
- Farbe pro Kalender/Gruppe
- Dark / Light / System Mode
- Standard-Ansicht wählbar
- Timezone-Einstellung

### 6. Benachrichtigungen
- **Web Push:** Browser-Benachrichtigungen (PWA, auch auf Mobile)
- **E-Mail:** Über Resend — Erinnerungen, Einladungen, Event-Updates
- **In-App:** Benachrichtigungs-Center in der App
- Konfigurierbar: pro Event-Typ und Kanal ein/ausschaltbar
- Erinnerungszeiten: 10min, 30min, 1h, 1d vor Event

### 7. Realtime
- Supabase Realtime für Live-Updates im Gruppenkalender
- Wenn jemand ein Event erstellt/ändert → alle Gruppen-Mitglieder sehen es sofort
- Online-Status der Gruppenmitglieder (optional)

---

## Liquid Glass Animations (Framer Motion Patterns)

```tsx
// Page Transition
const pageVariants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' }
}

// Modal Open
const modalVariants = {
  initial: { opacity: 0, scale: 0.95, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, scale: 1, backdropFilter: 'blur(20px)' },
  exit: { opacity: 0, scale: 0.97 }
}

// Event Card Hover
const eventCardVariants = {
  rest: { scale: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  hover: { scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
}

// Kalender View Switch (Slide)
const viewTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
}
```

---

## Wichtige Coding-Konventionen

- **TypeScript strict mode** überall — kein `any`
- **Server Components** by default, `'use client'` nur wenn nötig (Events, interaktive UI)
- **Supabase Server Client** in Server Components / Route Handlers
- **Supabase Browser Client** in Client Components (via Context Provider)
- **RLS (Row Level Security)** in Supabase — nie die Service Role im Client verwenden
- **date-fns** für alle Datums-Operationen — kein moment.js, kein dayjs
- **Zustand Store** nur für UI-State (aktuelle Ansicht, sichtbare Kalender) — Server-Daten via Supabase
- Komponenten in **PascalCase**, Hooks in **camelCase** mit `use`-Prefix
- API Routes in `app/api/` nur für externe Webhooks und Push-Notifications

---

## Hosting & Deployment

| Service | Zweck | Tier |
|---|---|---|
| **Vercel** | Next.js Frontend Hosting | Free → Pro bei Wachstum |
| **Supabase** | Backend, DB, Auth | Free → Pro ($25/Mo) |
| **Cloudflare** | Domain, DNS, CDN, DDoS | Free (Registrar ~10€/Jahr) |
| **Resend** | E-Mails | Free (3.000/Mo) → Scale |

### Vercel + GitHub Integration
- Vercel mit GitHub Repo verbinden → automatisches Deploy bei Push auf `main`
- Preview Deployments bei jedem PR (eigene URL zum Testen)
- Environment Variables in Vercel Dashboard setzen

### Custom Domain Setup
1. Domain bei Cloudflare kaufen
2. In Vercel: Settings → Domains → Custom Domain hinzufügen
3. Cloudflare DNS: CNAME Record auf `cname.vercel-dns.com` zeigen
4. SSL automatisch via Vercel

---

## Erste Schritte (Phase 1)

```bash
# 1. Next.js Projekt erstellen
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias "@/*"

# 2. Dependencies installieren
npm install @supabase/supabase-js @supabase/ssr framer-motion zustand date-fns lucide-react resend

# 3. Dev Dependencies
npm install -D @types/node supabase

# 4. Supabase CLI (für lokale Entwicklung)
npx supabase init
npx supabase start   # startet lokale Supabase Instanz

# 5. TypeScript Types aus Supabase generieren
npx supabase gen types typescript --local > lib/types/database.ts
```

---

## Was diese App besser macht als die Konkurrenz

| Feature | Google Calendar | Notion Calendar | Diese App |
|---|---|---|---|
| Liquid Glass Design | ❌ | ❌ | ✅ |
| Gruppen mit Rollen | Begrenzt | ❌ | ✅ Vollständig |
| Custom Farben pro Kalender | ✅ | ❌ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ Native |
| Framer Motion Animationen | ❌ | ❌ | ✅ |
| Web Push Notifications | ✅ | ❌ | ✅ |
| RSVP für Events | ✅ | ❌ | ✅ |
| Realtime Sync | Verzögert | ❌ | ✅ Supabase |
| Open Source / selbst hostbar | ❌ | ❌ | ✅ möglich |
| Personalisierung | Minimal | Minimal | ✅ Umfangreich |
