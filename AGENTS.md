# AGENTS.md

**Setup**
- Run `npm install` before any other command.
- Node ≥ 18 (Next.js 16) is recommended.

**Env**
- Create a `.env.local` (git‑ignored) with:
  - `OPENAI_API_KEY` – required for `/api/nibras-ai`.
  - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase client.
- Never commit `.env*`; they are excluded by `.gitignore`.

**Common npm scripts**
- `npm run dev` → Next development server (http://localhost:3000).
- `npm run build` → Production build into `.next`.
- `npm start` → Serve the built app (requires `npm run build`).
- `npm run lint` → Run `next lint`; treat warnings as errors.

**Path alias**
- `tsconfig.json` maps `@/*` → `./src/*`. Use imports like `import foo from "@/lib/foo"`.

**Supabase**
- Auth and role logic live in `src/lib/supabaseMiddleware.ts` and `src/proxy.ts`.
- Proxy redirects:
  - Unauthenticated users → `/login`.
  - Admins hitting `/` → redirect to `/admin`.
  - Regular users hitting `/admin` → redirect to home.
- Session cookies are managed by the middleware; ensure the Supabase keys are set.

**Rate limiting**
- `src/lib/rateLimit.ts` caps each IP to **50 requests per minute**.
- Exceeding returns 429 with `X-RateLimit‑*` headers.

**Nibras AI API (`/api/nibras-ai`)**
- POST body JSON must contain:
  - `messages`: array of `{role:"user"|"assistant",content:string}`.
  - `mode`: `"mentor"|"parent"|"curiosity"` (default `mentor`).
  - Optional `childAge` (used only for `curiosity`).
  - Optional `context` object (`balance`, `transactions`, `goals`, `income`, `expenses`).
- `mode` selects a system prompt (see `src/app/api/nibras-ai/route.ts`).
- If the last user message matches a task pattern, the server runs `executeTask` from `src/lib/ai-tasks.ts` and appends `USER DATA:` to the prompt.
- Responses stream via Server‑Sent Events; each chunk is `data: {"text":"..."}`. Errors returned as JSON with status 500/429.

**Task patterns (auto‑executed)**
- Zakat / calculation → `calculateZakat`.
- Savings ratio / percent → `calculateSavingsRatio`.
- Goal progress / bicycle / target → `calculateGoalProgress`.
- Health score / financial health → `calculateHealthScore`.
- Barakah / blessing / sadaqah → `analyzeBarakah`.

**NibrasAIChat component**
- Globally mounted in `src/app/layout.tsx`.
- Props: `mode`, `initialMessage`, `userName`, `childAge`.
- Uses `useNibrasAI` hook to talk to `/api/nibras-ai`.
- Client‑side only (`"use client"`).

**Git notes**
- Staged files include new `next.config.mjs`, `postcss.config.mjs`, and many source files.
- Untracked files (`src/app/global-error.tsx`, `src/app/not-found.tsx`, etc.) are safe to ignore unless needed.
- Do not amend commits or force‑push unless explicitly asked.

**General**
- The repo is a single Next.js app (no monorepo). All entrypoints under `src/app/`.
- Default Tailwind config is used; no custom `tailwind.config.js`.
- Vercel analytics and speed‑insights load only in production (`process.env.NODE_ENV === "production" && process.env.VERCEL`).