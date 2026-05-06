/**
 * migrate.js — One-shot import of all existing JSON data into Sanity.
 *
 * Run from the studio/ directory:
 *   node scripts/migrate.js
 *
 * Requires env vars (add to studio/.env.local):
 *   SANITY_STUDIO_PROJECT_ID=your_project_id
 *   SANITY_MIGRATE_TOKEN=your_editor_token
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../../src/_data')

// Load .env.local if dotenv is available (optional — env vars can also be set manually)
try {
  const { config } = await import('dotenv')
  config({ path: join(__dirname, '../.env.local') })
} catch { /* dotenv not installed — env vars must be set in shell */ }

// ---------------------------------------------------------------------------
// Sanity client
// ---------------------------------------------------------------------------
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const token = process.env.SANITY_MIGRATE_TOKEN

if (!projectId || !token) {
  console.error('❌  Missing env vars. Set SANITY_STUDIO_PROJECT_ID and SANITY_MIGRATE_TOKEN in studio/.env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function readJson(filename) {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf8'))
}

/** Generate a stable Sanity-safe _key from a string */
function toKey(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 64)
}

let imported = 0
let skipped = 0

async function upsert(doc) {
  try {
    await client.createOrReplace(doc)
    console.log(`  ✅ ${doc._type}: ${doc._id}`)
    imported++
  } catch (err) {
    console.error(`  ❌ Failed ${doc._id}:`, err.message)
    skipped++
  }
}

// ---------------------------------------------------------------------------
// 1. Site Settings (singleton)
// ---------------------------------------------------------------------------
async function migrateSiteSettings() {
  console.log('\n📋 Site Settings')
  const s = readJson('site.json')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: s.title,
    description: s.description,
    townName: s.townName,
    state: s.state,
    address: s.address,
    phone: s.phone,
    email: s.email,
    hours: s.hours,
  })
}

// ---------------------------------------------------------------------------
// 2. Selectboard Minutes
// ---------------------------------------------------------------------------
async function migrateMinutes() {
  console.log('\n📁 Selectboard Minutes')
  const { selectboard_minutes } = readJson('minutes.json')

  for (const group of selectboard_minutes) {
    const documents = (group.docs || []).map((doc, i) => ({
      _type: 'meetingDoc',
      _key: `${group.fy}_${toKey(doc.name)}_${i}`,
      meetingName: doc.name,
      fileType: doc.type || 'docx',
      fileUrl: doc.url,
    }))

    await upsert({
      _id: `selectboardMinuteGroup-fy${group.fy}`,
      _type: 'selectboardMinuteGroup',
      fy: group.fy,
      title: group.label || `FY ${group.fy} — Selectboard Minutes`,
      openByDefault: group.open === true,
      documents,
    })
  }
}

// ---------------------------------------------------------------------------
// 3. Announcements
// ---------------------------------------------------------------------------
async function migrateAnnouncements() {
  console.log('\n📣 Announcements')
  const data = readJson('announcements.json')

  // Build a set of URLs that are marked featured
  const featuredUrls = new Set((data.featured || []).map(f => f.url))

  // Track which items we've already created (deduplicate by URL)
  const seen = new Set()

  // Also import featured items that don't appear in any section
  const allSectionUrls = new Set(
    (data.sections || []).flatMap(s => (s.items || []).map(i => i.url))
  )

  // Process section items
  let orderCounter = 1
  for (const section of (data.sections || [])) {
    for (const item of (section.items || [])) {
      if (seen.has(item.url)) continue
      seen.add(item.url)

      const key = toKey(`${section.id}_${item.title}`)
      await upsert({
        _id: `announcement-${key}`,
        _type: 'announcement',
        title: item.title,
        description: item.description,
        fileUrl: item.url,
        fileType: item.type || 'pdf',
        section: section.id,
        featured: featuredUrls.has(item.url),
        order: orderCounter++,
      })
    }
  }

  // Any featured items not in any section (edge case)
  for (const item of (data.featured || [])) {
    if (seen.has(item.url)) continue
    seen.add(item.url)

    const key = toKey(`featured_${item.title}`)
    await upsert({
      _id: `announcement-${key}`,
      _type: 'announcement',
      title: item.title,
      description: item.description,
      fileUrl: item.url,
      fileType: item.type || 'pdf',
      section: 'latest-news',
      featured: true,
      order: orderCounter++,
    })
  }
}

// ---------------------------------------------------------------------------
// 4. Forms
// ---------------------------------------------------------------------------
async function migrateForms() {
  console.log('\n📄 Forms & Documents')
  const { forms } = readJson('forms.json')

  for (let i = 0; i < forms.length; i++) {
    const f = forms[i]
    const key = toKey(f.title)
    await upsert({
      _id: `form-${key}`,
      _type: 'form',
      title: f.title,
      description: f.description,
      url: f.url,
      iconType: f.iconType || 'tool',
      order: i + 1,
    })
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🚀 Starting Sanity migration...')
  console.log(`   Project: ${projectId}  Dataset: production\n`)

  await migrateSiteSettings()
  await migrateMinutes()
  await migrateAnnouncements()
  await migrateForms()

  console.log(`\n✨ Done! ${imported} documents imported, ${skipped} failed.`)
  console.log('   Agendas, Annual Reports, and Warrants can be entered directly in Sanity Studio.')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
