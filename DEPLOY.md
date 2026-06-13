# Deploy

## 1. Push to personal GitHub

Use your **personal** GitHub account (not work). One-time setup:

```bash
cd ~/Documents/solar-kw-calculator

# Local identity for this repo only (personal)
git config user.email "rbalaguru013@gmail.com"
git config user.name "Your Name"

# If work SSH key is default, use HTTPS for personal GitHub:
git remote add origin https://github.com/YOUR_PERSONAL_USERNAME/solar-kw-calculator.git
```

Create the empty repo on GitHub (personal account): **New repository** → name `solar-kw-calculator` → Public → no template.

Then push:

```bash
git push -u origin main
```

When prompted for HTTPS credentials, use a **Personal Access Token** (not work password).
Create token: GitHub → Settings → Developer settings → Personal access tokens → `repo` scope.

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

Every push to `main` auto-deploys. No env vars needed.

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
