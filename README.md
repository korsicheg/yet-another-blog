# Yet Another Blog

A personal blog and video platform built with Next.js and Payload CMS.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **CMS:** Payload CMS 3 (embedded)
- **Database:** Neon Serverless Postgres
- **Styling:** Tailwind CSS v4
- **Storage:** Vercel Blob (optional, for media uploads)

## Features

- Blog posts with rich text editing (Lexical editor)
- Video embeds with automatic YouTube/Vimeo detection
- Like system (no auth required, localStorage dedup)
- Moderated comments on posts and videos
- Admin panel at `/admin` with role-based access control
- Responsive images with multiple generated sizes

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/yet-another-blog.git
   cd yet-another-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   DATABASE_URI=postgresql://...        # Neon Postgres connection string
   PAYLOAD_SECRET=your-secret-here      # 32+ character secret
   BLOB_READ_WRITE_TOKEN=...            # Optional: Vercel Blob token for media
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) to create your first admin user.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbo |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm test` | Run all tests (unit + E2E) |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright E2E with interactive UI |
| `npm run generate:types` | Regenerate Payload TypeScript types |
| `npm run generate:importmap` | Regenerate Payload import map |

## Project Structure

```
e2e/                     # Playwright E2E tests
src/
├── app/
│   ├── (frontend)/      # Public-facing pages (blog, videos, about)
│   ├── (payload)/       # Payload admin panel & auto-generated API
│   └── api/             # Custom API routes (likes, comments)
├── collections/         # Payload CMS collection definitions
├── globals/             # Payload CMS global definitions
├── components/          # React components
└── lib/                 # Utilities (includes unit tests *.test.ts)
```

## License

All rights reserved.
