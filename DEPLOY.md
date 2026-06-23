# Deploy

## 1. Push to personal GitHub

Use your **personal** GitHub account (not work). One-time setup:

```bash
cd ~/Documents/solar-kw-calculator

# Personal identity for THIS repo only (already set if you used setup below)
git config user.email "rbalaguru013@gmail.com"
git config user.name "Balaguru"
git config commit.gpgsign false   # avoid work GPG signing on personal commits

# Commit (only after identity is correct)
git commit -m "Add TNEB solar kW calculator SPA"
```

Create the empty repo on GitHub (personal account): **New repository** → name `solar-kw-calculator` → Public → no template.

```bash
# If work SSH key is default, use HTTPS for personal GitHub:
git remote add origin https://github.com/YOUR_PERSONAL_USERNAME/solar-kw-calculator.git
```

Then push:

```bash
git push -u origin main
```

When prompted for HTTPS credentials, use a **Personal Access Token** (not work password).
Create token: GitHub → Settings → Developer settings → Personal access tokens → `repo` scope.

### Fix: `Permission denied to balaguruua` (wrong GitHub account)

macOS may be using your **work** GitHub login (`balaguruua`) for all HTTPS pushes. The repo is under **madbala** — you must authenticate as **madbala**.

**Step 1 — Clear cached GitHub login:**

```bash
printf "protocol=https\nhost=github.com\n" | git credential-osxkeychain erase
```

Or: Keychain Access → search `github.com` → delete the internet password entry.

**Step 2 — Create a PAT on the madbala account**

1. Log into GitHub as **madbala** (personal)
2. Settings → Developer settings → Personal access tokens → Generate new token (classic)
3. Scope: `repo` → copy the token

**Step 3 — Push again**

```bash
cd ~/Documents/solar-kw-calculator
git push -u origin main
```

When prompted:
- **Username:** `madbala`
- **Password:** paste the **token** (not your GitHub password)

**Optional — GitHub CLI (cleanest for two accounts):**

```bash
brew install gh
gh auth login   # browser → log in as madbala
gh auth setup-git
git push -u origin main
```

**Optional — SSH (separate key for personal):**

```bash
# ~/.ssh/config
# Host github.com-personal
#   HostName github.com
#   User git
#   IdentityFile ~/.ssh/id_ed25519_personal

git remote set-url origin git@github.com-personal:madbala/ubsolars-kw-calculator.git
git push -u origin main
```

### Alternative: GitHub CLI (personal account)

```bash
brew install gh
gh auth login   # choose GitHub.com → HTTPS → Login with browser → personal account
gh repo create solar-kw-calculator --public --source=. --push
```

---

## 2. Deploy on Vercel (recommended for Next.js)

### Option A — Git integration (easiest)

1. [vercel.com](https://vercel.com) → sign in with **personal GitHub**
2. **Add New Project** → import `solar-kw-calculator`
3. Framework: Next.js (auto-detected) → **Deploy**

### Shared admin settings

Dashboard values (tariff, pricing, company info) are stored in `data/app-settings.json` locally, or in **Vercel Blob** in production.

**Local / VPS:** Unlock admin → edit → **Save settings** writes `data/app-settings.json`. New page loads fetch once from `/api/settings`.

**Vercel (recommended):** Use Blob so admin saves persist across serverless deploys.

1. Vercel project → **Storage** → **Create Database** → **Blob** (private or public store both work; this app uses **private** access via server API only)
2. Connect the store to this project (Vercel sets `BLOB_READ_WRITE_TOKEN` automatically)
3. Redeploy, unlock admin, save settings once — settings are stored as `ubsolars-app-settings.json` in Blob
4. Visitors load settings once per visit from `/api/settings` (no polling)

**Free Hobby plan impact:** Blob is included on Hobby. This app uses ~1 KB storage and one read per page load plus rare admin writes — well within the free limits (1 GB storage, 10K reads / 2K writes per rolling 30 days). No extra hosting charge; performance impact is negligible (~tens of ms per visit). Mobile clients are unchanged (same HTTPS API).

Without Blob on Vercel, file writes do not persist; commit `data/app-settings.json` or use code defaults until Blob is wired.

Every push to `main` auto-deploys.

### Option B — GitHub Actions (this repo)

1. Vercel → Project → Settings → General → copy **Project ID**
2. Vercel → Account Settings → copy **Team/User ID** (Org ID)
3. Vercel → Account → Tokens → create token
4. GitHub repo → Settings → Secrets and variables → Actions:

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Vercel token |
| `VERCEL_ORG_ID` | Team/User ID |
| `VERCEL_PROJECT_ID` | Project ID |

Push to `main` runs `.github/workflows/deploy-vercel.yml`.

---

## 3. Deploy on Netlify (alternative)

1. [netlify.com](https://netlify.com) → sign in with personal GitHub
2. **Add new site** → Import `solar-kw-calculator`
3. Build command: `npm run build` (or use `netlify.toml` in repo)
4. Deploy

Netlify uses `@netlify/plugin-nextjs` from `netlify.toml`.

---

## CI

`.github/workflows/ci.yml` runs lint + build on every push and PR.
