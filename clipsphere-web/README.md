# ClipSphere Web

Next.js 16 App Router frontend for ClipSphere — a short-video sharing platform. Dark-first "Electric Cinema" design with real video thumbnails, JWT cookie auth, and a proxied connection to the Express backend.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 + |
| ClipSphere API | running at http://localhost:5000 |

Start the backend first — see `../backend/README.md`.

---

## Quick start

```bash
npm install
npm run dev
```

App opens at **http://localhost:3000**.

---

## How it connects to the backend

`next.config.ts` rewrites all `/api/v1/*` requests to `http://localhost:5000/api/v1/*`. No CORS setup is needed in development — every API call goes through the Next.js dev server proxy.

```ts
// next.config.ts
rewrites: [{ source: "/api/v1/:path*", destination: "http://localhost:5000/api/v1/:path*" }]
```

No `.env` file is required for local development.

---

## Pages

| Route | Page | Auth required |
|---|---|---|
| `/` | Discovery feed (All / Following / Trending tabs) | Following tab requires login |
| `/video/[id]` | Video player, likes, reviews | Like/review require login |
| `/profile/[id]` | User profile, video grid, follow button | Follow requires login |
| `/upload` | Video upload form | ✓ |
| `/settings` | Profile edit, avatar, notification preferences | ✓ |
| `/login` | Sign-in form | — |
| `/register` | Registration form | — |
| `/admin` | Admin dashboard — stats, health, moderation | ✓ admin role |

Route protection is enforced by Next.js Edge Middleware (`src/middleware.ts`) — unauthenticated requests to protected pages are redirected to `/login`.

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── (feeds)/            # Route group: feed page + feeds layout
│   ├── video/[id]/         # Video detail page
│   ├── profile/[id]/       # User profile page
│   ├── upload/             # Upload page
│   ├── settings/           # Settings page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── admin/              # Admin dashboard
│   ├── layout.tsx          # Root layout (fonts, AuthProvider, Navbar, Footer)
│   └── globals.css         # Tailwind v4 @theme tokens + global utilities
├── components/
│   ├── feed/               # VideoCard, FeedGrid, FeedTabs
│   ├── video/              # VideoPlayer, LikeButton, ShareButton, ReviewForm, ReviewCard, ReviewList, CommentSection, StarRating
│   ├── upload/             # VideoForm, EditVideoModal, DeleteConfirmModal
│   ├── profile/            # ProfileHeader, UserVideoGrid, FollowButton
│   ├── admin/              # StatsCards, HealthWidget, ModerationTable
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # Spinner, Toast, ErrorMessage, SkeletonCard, SkeletonFeed
├── context/
│   └── AuthContext.tsx     # Auth state (user, login, logout, refreshUser)
├── hooks/
│   └── useAuth.ts          # Thin wrapper over AuthContext
├── services/
│   └── api.ts              # Axios instance with JWT cookie interceptor
├── types/
│   └── index.ts            # Shared TypeScript interfaces (User, Video, Review, …)
└── utils/
    ├── avatarUrl.ts         # Presigned avatar URL fetcher (5-min cache)
    └── thumbnailUrl.ts      # Presigned thumbnail URL fetcher (10-min cache)
```

---

## Authentication

- JWT is stored in a browser cookie named `token` (set by `js-cookie` after login).
- `src/services/api.ts` reads the cookie and injects `Authorization: Bearer <token>` on every Axios request.
- `AuthContext` calls `GET /api/v1/users/me` on mount and after any mutation that changes the user — the context never trusts mutation responses directly.
- Next.js Edge Middleware checks the `token` cookie and redirects unauthenticated users away from protected routes.

---

## Design system

The UI uses a custom "Electric Cinema" design system built entirely with **Tailwind v4 CSS tokens** (no `tailwind.config.ts`). All design tokens are declared in `src/app/globals.css` under `@theme inline`.

| Token group | Purpose |
|---|---|
| `--color-surface` / `surface-2` / `surface-3` | Dark panel hierarchy |
| `--color-brand-*` | Electric coral primary accent (#FF6B5B) |
| `--color-gold` | Amber secondary accent (#FFBE0B) for ratings and badges |
| `--color-violet` | Soft violet tertiary (#A78BFA) |
| `--color-text-strong` / `text` / `text-muted` / `text-faint` | Warm cream text scale |
| `--color-border` / `border-subtle` / `border-accent` | Border hierarchy |
| `--font-display` | Syne — used for headings and display text |
| `--font-body` | Plus Jakarta Sans — used for body and UI copy |

Utility classes defined in globals.css: `.glass`, `.glow-accent`, `.grain`, `.animate-fade-in-up`, `.animate-stagger-in`.

---

## npm scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server at http://localhost:3000 (webpack mode) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
