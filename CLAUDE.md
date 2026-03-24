# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (Next.js + Turbo)
npm run build            # Production build
npm run generate:types   # Regenerate Payload CMS TypeScript types (src/payload-types.ts)
npm run generate:importmap # Regenerate Payload CMS import map
```

No test runner is configured.

## Architecture

**Stack:** Next.js 16 (App Router) + Payload CMS 3 + Neon Serverless Postgres + Tailwind CSS v4

This is a CMS-driven blog/video platform. Payload CMS is embedded inside Next.js — both the admin panel and the public site run in the same app.

### Route Groups

- `src/app/(frontend)/` — Public pages (blog listing, video listing, individual posts/videos, about)
- `src/app/(payload)/` — Payload admin panel at `/admin` and auto-generated REST API at `/api/[...slug]`
- `src/app/api/` — Custom API routes for likes and comments (with origin validation)

### Data Flow

Pages are Server Components that fetch data directly via `getPayload(config)` (no HTTP calls to the API). Interactive features (likes, comments) use Client Components that call the custom API routes.

### Collections (src/collections/)

Five Payload collections define all data: **Users** (auth + roles), **Posts** (blog content with Lexical rich text), **Videos** (YouTube/Vimeo embeds with auto-platform detection), **Comments** (polymorphic — linked to either Posts or Videos, require admin approval), **Media** (images with 4 generated sizes: thumbnail, card, blogCard, hero).

**About** is a Payload Global (src/globals/About.ts), not a collection.

### Access Control Pattern

All collections use the same pattern: authenticated users get full CRUD, public users can only read published/approved content. Exception: Comments allow unauthenticated create (moderation queue). Users collection restricts create/delete to admins, update to admin-or-self.

### Key Conventions

- All frontend pages use `export const dynamic = 'force-dynamic'`
- Path aliases: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`
- Likes use localStorage to prevent duplicate votes (no auth required)
- Comments require admin approval before public display (`approved: false` default)
- API routes validate request origin via `src/lib/security.ts`

## Environment Variables

```
DATABASE_URI       # Neon Postgres connection string (required)
PAYLOAD_SECRET     # 32+ char secret for Payload CMS (required)
BLOB_READ_WRITE_TOKEN  # Vercel Blob storage token (optional, for media)
```
