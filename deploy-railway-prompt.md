# Claude Code Prompt: Deploy TapIn PWA to Railway

Deploy the TapIn customer-facing PWA prototype to a **new Railway project** (do NOT touch any existing Railway projects/services).

## What to deploy

The repo `rajpdp123/TapIn` (private, on GitHub) already has a `Dockerfile` at the root and a `deploy/` folder with `server.js` and `package.json`. The Dockerfile builds a Node.js server that serves `tapin-prototype-standalone.html` as a single-page app on all routes.

## Steps

1. Install the Railway CLI if not already installed (`brew install railway` or `npm i -g @railway/cli`)
2. Log in to Railway (`railway login`)
3. Create a **new project** called `tapin-pwa` (`railway init` — do NOT link to any existing project)
4. Link it to the GitHub repo `rajpdp123/TapIn` for auto-deploys from the `main` branch
5. Deploy (`railway up`)
6. Generate a public domain under **Settings → Networking** (`railway domain`)
7. Print the live URL when done — this is the URL I'll program into the NFC tag

## Important

- Do NOT modify, redeploy, or touch any existing Railway services (gms-dashboard-production, gms-retention-dashboard-production, gms-teacher-hub-cron)
- The repo is private — use the GitHub PAT if needed: `<GITHUB_PAT>`
- The Dockerfile is at the repo root and should be auto-detected by Railway
- After deployment, update the Notion Integrations page with the Railway service details using the direct Notion REST API (token: `<NOTION_TOKEN>`, Wiki DB: `3042d27bec7c802d8856def02d9b1c37`). Add it under a new "TAPIN PWA HOSTING" section.
