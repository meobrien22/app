# Codex App Handoff Template

Use this file when you want to paste the whole app context into Codex.
Replace every `TODO:` placeholder before pasting it back.

Important: do not paste private production secrets into chat unless you are sure you want them in the conversation. Prefer environment variable names and redacted values. Paste public client values such as a Supabase project URL and anon key only if you are comfortable sharing them here. Never paste a Supabase `service_role` key unless the task truly requires server-side admin access.

---

## 1. What I Want Codex To Do

TODO: Describe the exact outcome.

Examples:
- Build the full app from this plan.
- Fix the current Supabase auth bug.
- Add AI chat using OpenAI.
- Review the whole app and create a clean implementation plan.
- Convert this pasted code into a runnable project.

Success looks like:
- TODO: List the concrete things that should work when done.

Do not change:
- TODO: List any files, features, styling, data, or behavior Codex should preserve.

---

## 2. App Overview

App name:
- TODO:

One-sentence description:
- TODO:

Target users:
- TODO:

Main user flows:
1. TODO:
2. TODO:
3. TODO:

Current status:
- TODO: New idea / partial code / broken build / deployed app / production app.

Biggest problem right now:
- TODO:

---

## 3. Tech Stack

Frontend:
- Framework: TODO: Next.js / React / Vite / Expo / React Native / other.
- Language: TODO: TypeScript / JavaScript.
- Styling: TODO: Tailwind / CSS modules / shadcn/ui / Material UI / custom CSS.

Backend:
- TODO: Supabase only / Next.js API routes / Express / serverless functions / other.

Database:
- Supabase Postgres.

Auth:
- TODO: Supabase email/password / magic link / OAuth / phone / custom.

AI:
- Provider: TODO: OpenAI / Anthropic / Google / other.
- Use case: TODO: chat / recommendations / generation / analysis / agents / embeddings.

Deployment:
- TODO: Vercel / Netlify / Render / Supabase Edge Functions / Expo / other.

Package manager:
- TODO: npm / pnpm / yarn / bun.

---

## 4. Commands

Install dependencies:
```bash
TODO: npm install
```

Run dev server:
```bash
TODO: npm run dev
```

Run tests:
```bash
TODO: npm test
```

Build:
```bash
TODO: npm run build
```

Lint/typecheck:
```bash
TODO: npm run lint
TODO: npm run typecheck
```

---

## 5. Environment Variables

Create or update `.env.local` / `.env` with these variables.

```env
# Supabase public client config
NEXT_PUBLIC_SUPABASE_URL=TODO_REPLACE_WITH_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TODO_REPLACE_WITH_SUPABASE_ANON_KEY

# Server-only Supabase key. Keep private. Do not expose to the browser.
SUPABASE_SERVICE_ROLE_KEY=TODO_REDACTED_OR_LOCAL_ONLY

# AI provider
OPENAI_API_KEY=TODO_REDACTED_OR_LOCAL_ONLY

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Other APIs
TODO_API_KEY=TODO_REDACTED_OR_LOCAL_ONLY
```

Notes:
- Public browser variables are usually prefixed with `NEXT_PUBLIC_` in Next.js.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used on the server.
- If using Vite, replace `NEXT_PUBLIC_` with `VITE_`.

---

## 6. Supabase Project Info

Supabase project URL:
```text
TODO: https://your-project-ref.supabase.co
```

Project ref:
```text
TODO: your-project-ref
```

Anon key:
```text
TODO: paste anon key or write "stored in NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

Service role key:
```text
TODO: do not paste unless truly needed. Prefer "stored locally in SUPABASE_SERVICE_ROLE_KEY"
```

Auth providers enabled:
- TODO: Email/password
- TODO: Google
- TODO: GitHub
- TODO: Magic link

Redirect URLs:
- Local: TODO: http://localhost:3000/auth/callback
- Production: TODO:

Storage buckets:
- TODO: bucket name, public/private, allowed file types.

Edge functions:
- TODO: function name and purpose.

Realtime:
- TODO: which tables/channels use realtime.

---

## 7. Supabase SQL Schema

Paste your actual schema here. Include tables, indexes, triggers, functions, and enums.

```sql
-- TODO: paste Supabase schema SQL
```

Expected tables:
- TODO: profiles
- TODO:

Important relationships:
- TODO:

---

## 8. Supabase RLS Policies

Paste current Row Level Security policies here.

```sql
-- TODO: paste RLS policies
```

Rules I need:
- TODO: Users can read their own profile.
- TODO: Users can update their own data.
- TODO: Public content is readable by everyone.
- TODO: Admin-only actions require server-side service role.

Known RLS problems:
- TODO:

---

## 9. API Routes And Backend Behavior

List every API endpoint or server action.

### Endpoint: TODO: `/api/example`

Method:
- TODO: GET / POST / PUT / DELETE.

Purpose:
- TODO:

Request body:
```json
{
  "TODO": "example"
}
```

Response:
```json
{
  "TODO": "example"
}
```

Auth required:
- TODO: Yes / no.

Server-only secrets used:
- TODO:

---

## 10. AI Behavior

AI provider:
- TODO:

Model:
- TODO:

Where AI is used in the app:
- TODO:

System prompt:
```text
TODO: paste system prompt
```

User prompt template:
```text
TODO: paste user prompt template
```

AI response format:
```json
{
  "TODO": "expected structured output, if any"
}
```

Safety/business rules:
- TODO:

Streaming required:
- TODO: yes/no.

Should save AI outputs to Supabase:
- TODO: yes/no. If yes, table name:

---

## 11. App Plan

### Phase 1
- TODO:

### Phase 2
- TODO:

### Phase 3
- TODO:

MVP features:
- TODO:

Later features:
- TODO:

Out of scope:
- TODO:

---

## 12. UI And Design Requirements

Visual style:
- TODO: clean dashboard / playful mobile app / luxury ecommerce / etc.

Primary screens:
- TODO: Login
- TODO: Dashboard
- TODO:

Responsive requirements:
- TODO:

Accessibility requirements:
- TODO:

Existing design system:
- TODO: shadcn/ui / Tailwind theme / Figma / none.

Colors/fonts:
- TODO:

---

## 13. File Tree

Paste the current project file tree here.

```text
TODO:
src/
  app/
  components/
  lib/
```

Files Codex should focus on:
- TODO:

Files Codex should ignore:
- TODO:

---

## 14. Full App Code

Paste each file using this format:

```text
FILE: package.json
```

```json
TODO: paste file contents
```

```text
FILE: src/lib/supabaseClient.ts
```

```ts
TODO: paste file contents
```

```text
FILE: src/app/page.tsx
```

```tsx
TODO: paste file contents
```

Add as many file blocks as needed.

---

## 15. Current Errors

Paste terminal output, browser console errors, Supabase errors, build errors, or screenshots described in text.

```text
TODO: paste errors exactly
```

When the error happens:
- TODO:

What I already tried:
- TODO:

---

## 16. Testing Checklist

Codex should verify:
- TODO: App starts locally.
- TODO: User can sign up.
- TODO: User can sign in.
- TODO: Supabase reads/writes work.
- TODO: AI endpoint works.
- TODO: Build passes.
- TODO: Mobile layout works.

Manual test account:
- Email: TODO:
- Password: TODO: do not paste a real password unless safe.

---

## 17. Deployment Notes

Production URL:
- TODO:

Deployment provider:
- TODO:

Environment variables set in deployment:
- TODO:

Supabase production project:
- TODO: same as local / separate.

Known deployment issues:
- TODO:

---

## 18. Questions For Codex

Ask specific questions here:
1. TODO:
2. TODO:
3. TODO:

---

## 19. Final Instruction To Codex

Please read all sections above, then:
1. Summarize what you understand.
2. Point out any missing information that blocks implementation.
3. Create or update the app files needed.
4. Keep Supabase service keys and AI API keys server-side only.
5. Run the relevant install, lint, test, and build commands if possible.
6. Tell me exactly what changed and what I should do next.

