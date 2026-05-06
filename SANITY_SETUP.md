# Sanity CMS — Setup & Go-Live Steps

Your Sanity project is already created (Project ID: `hs5p5cc4`). Follow these steps in order. Do not skip steps.

---

## Step 1 — Install dependencies

Open **Git Bash** and paste these commands one at a time. Wait for each one to finish before running the next.

```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site"
npm install
```

```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site/studio"
npm install
```

You should see packages being downloaded. No red errors means you're good.

---

## Step 2 — Run the migration (imports all existing data into Sanity)

This reads your existing JSON files and pushes everything into Sanity. It only needs to be run once.

Still in Git Bash, paste this entire block as one command:

```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site/studio"
SANITY_MIGRATE_TOKEN=sk6AKXxg4xL7tUuTxwkIPHgczjkKQN2CuXQuknkEpBzbbqT2f2ASUMQsQYCuMn5O1kUjWg6LLHXamugAc3zQHlpdGIraTlN9tqgBS6v6AOnwi3RclUsvda12S31CjOeSJ3cF5bIsR8L8lVsVu42P3vfqIdtQQ1WNtLLi0csLIWfUpCJkIoha SANITY_STUDIO_PROJECT_ID=hs5p5cc4 node scripts/migrate.js
```

You should see a list of ✅ lines, one for each document (minutes, announcements, forms, site settings). If anything shows ❌, let me know.

---

## Step 3 — Delete the old Decap CMS files

Open **Windows Explorer** and delete these three things. You can right-click → Delete on each one.

- Entire folder: `C:\Users\Administrator\Documents\Claude\Projects\Town of Florida Website\eleventy-site\src\admin`
- File: `C:\Users\Administrator\Documents\Claude\Projects\Town of Florida Website\eleventy-site\api\auth.js`
- File: `C:\Users\Administrator\Documents\Claude\Projects\Town of Florida Website\eleventy-site\api\callback.js`

After deleting, the `api\` folder should be empty (you can leave the empty folder there).

---

## Step 4 — Deploy Sanity Studio

This publishes the admin interface to a public URL so you (and eventually the town) can manage content from any browser.

In Git Bash:

```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site/studio"
npm run deploy
```

Sanity will ask you to pick a hostname. Type something like `florida-ma` and press Enter. When it finishes, your Studio will be live at:

**`https://florida-ma.sanity.studio`**

You can bookmark this and share it with the town clerk when the time comes. Sign in with your Google account.

---

## Step 5 — Add the API token to Vercel

The Eleventy build needs this token to pull data from Sanity each time the site is deployed.

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your **tof-11ty** project
3. Click **Settings** (top nav) → **Environment Variables** (left sidebar)
4. Click **Add New**
5. Fill in:
   - **Key:** `SANITY_API_TOKEN`
   - **Value:** `sk6AKXxg4xL7tUuTxwkIPHgczjkKQN2CuXQuknkEpBzbbqT2f2ASUMQsQYCuMn5O1kUjWg6LLHXamugAc3zQHlpdGIraTlN9tqgBS6v6AOnwi3RclUsvda12S31CjOeSJ3cF5bIsR8L8lVsVu42P3vfqIdtQQ1WNtLLi0csLIWfUpCJkIoha`
   - **Environments:** Make sure Production, Preview, and Development are all checked
6. Click **Save**

---

## Step 6 — Set up auto-deploy (Sanity → Vercel webhook)

This makes the website rebuild automatically every time you hit Publish in Sanity Studio. Without this, you'd have to trigger deploys manually.

**Part A — Create a deploy hook in Vercel:**

1. In Vercel → **tof-11ty** → **Settings** → **Git**
2. Scroll down to **Deploy Hooks**
3. Click **Create Hook**
   - Hook name: `Sanity Content Update`
   - Branch: `main`
4. Click **Create Hook**
5. Copy the URL it generates (it looks like `https://api.vercel.com/v1/integrations/deploy/...`) — you'll need it in a moment

**Part B — Add the webhook in Sanity:**

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click on your project **hs5p5cc4** (Town of Florida)
3. Click **API** in the left sidebar → **Webhooks**
4. Click **Add webhook**
5. Fill in:
   - **Name:** `Vercel Deploy`
   - **URL:** paste the URL you copied from Vercel
   - **Dataset:** `production`
   - **Trigger on:** check **Publish** (you can uncheck the others)
6. Click **Save**

From this point on: publish something in Sanity → site rebuilds in ~60 seconds.

---

## Step 7 — Commit and push everything to GitHub

In Git Bash:

```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site"
git add -A
git commit -m "Migrate from Decap CMS to Sanity"
git push
```

Vercel will pick this up, run a build, and deploy. Since you just added the `SANITY_API_TOKEN` in Step 5, this build will pull live data from Sanity.

---

## How content editing works going forward

1. Open `https://florida-ma.sanity.studio` (or whatever hostname you chose in Step 4)
2. Sign in with your Google account
3. Make your changes — add an announcement, upload a new agenda, etc.
4. Click **Publish** in the top right
5. The website automatically rebuilds and goes live in about 60 seconds

---

## Transferring everything to the Town when they buy the site

**Sanity:**
- [sanity.io/manage](https://sanity.io/manage) → project `hs5p5cc4` → **Members** → invite their email as Administrator → remove yourself after they accept

**Vercel:**
- `tof-11ty` project → **Settings** → **Members** → transfer ownership to their Vercel account

**GitHub:**
- Repository `aricoenterprises/TOF_11ty` → **Settings** → **Danger Zone** → Transfer Ownership

---

## Troubleshooting

**Migration script fails with "permission denied" or "unauthorized":**
The token may need Editor-level access. Go to [sanity.io/manage](https://sanity.io/manage) → project → **API** → **Tokens** → **Add API token** → choose **Editor** role → use that new token in place of the one in the migrate command.

**Build fails on Vercel after push:**
Check that the `SANITY_API_TOKEN` environment variable was saved correctly in Step 5. In Vercel → project → **Settings** → **Environment Variables**, the key should appear in the list (value will be hidden).

**Studio deploy asks you to log in:**
Run this first in Git Bash, then retry `npm run deploy`:
```bash
cd "C:/Users/Administrator/Documents/Claude/Projects/Town of Florida Website/eleventy-site/studio"
npx sanity login
```
