# AE Customer Value Discovery Engine

A Vite + React prototype for a Microsoft Account Executive discovery workspace with account setup, trigger scanning, stakeholder mapping, add-on fit scoring, business value scoring, example discovery journeys, and a persistent AI command center.

## Run Locally

```bash
npm install
npm run dev
```

The Supabase anon configuration is stored in `.env.local`. Server-only keys such as `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` should stay out of browser code.

## Host on GitHub Pages

Upload the source files in this folder to a GitHub repository. Do not upload `node_modules`, `dist`, `.env.local`, or the Vite log files.

In GitHub, open the repository and go to:

`Settings -> Secrets and variables -> Actions -> New repository secret`

Add these optional browser-safe secrets if you want Supabase enabled in the hosted demo:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then go to:

`Settings -> Pages -> Build and deployment -> Source`

Choose `GitHub Actions`.

When you push to the `main` branch, the workflow in `.github/workflows/deploy-pages.yml` will run `npm ci`, build the app, and publish the `dist` folder to GitHub Pages.

You can also host the already-built static files by uploading the contents of the generated `dist` folder to any static hosting provider.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor to create the tables from the master project file.

If you see `new row violates row-level security policy for table "accounts"`, run `supabase/rls-prototype.sql` in the Supabase SQL Editor. It adds a prototype-only anon insert/read policy so the current browser app can save accounts.

After this discovery-phase upgrade, rerun both files to ensure the new tables and policies exist for:
- stakeholder discovery meetings and level responses
- scheduled discovery meetings
- workshop agenda items
- V-Team assignments
- keyword tallies and running plan snapshots

This prototype currently writes accounts directly from the browser with the Supabase anon client. For production, add authenticated users, ownership columns, and owner-based Row Level Security policies before storing customer data.

The app intentionally avoids product amount calculations. Microsoft products and add-ons are used only for discovery mapping, fit scoring, and next-best-action guidance.
