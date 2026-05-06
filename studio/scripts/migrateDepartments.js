/**
 * Migration script — imports all 17 Town Departments & Officials into Sanity.
 *
 * Run from the studio/ folder:
 *   node scripts/migrateDepartments.js
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@sanity/client'

const token = process.env.SANITY_MIGRATE_TOKEN
if (!token) {
  console.error('ERROR: SANITY_MIGRATE_TOKEN not found. Check that studio/.env.local exists and contains the token.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'hs5p5cc4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function official(fields) {
  return { _type: 'official', _key: key(), ...fields }
}

function link(label, url) {
  return { _type: 'cardLink', _key: key(), label, url }
}

const DEPARTMENTS = [
  {
    _id:       'department-selectmen',
    _type:     'department',
    anchorId:  'selectmen',
    category:  'elected',
    icon:      'government',
    title:     'Board of Selectmen',
    subtitle:  'Meets every other Wednesday at 6:00pm · (413) 662-2448 ext. 0 · TownAdmin@TownOfFlorida.org',
    order:     1,
    officials: [
      official({ name: 'Neil Oleson',    role: 'Selectmen Chair', phone: '(413) 662-2448 ext. 0', email: 'townadmin@townofflorida.org', notes: 'Select Board meets every other Wednesday at 6:00pm' }),
      official({ name: 'Michael Bedini', role: 'Selectmen' }),
      official({ name: 'Timothy Zelazo', role: 'Selectmen' }),
      official({ name: 'Current or Emergency Town Notice', isHighlighted: true, notes: 'For current emergency notices, please contact Town Hall at (413) 662-2448 or check the Announcements page.', links: [link('View Announcements', '/announcements.html')] }),
    ],
  },
  {
    _id:       'department-town-admin',
    _type:     'department',
    anchorId:  'town-admin',
    category:  'admin',
    icon:      'person',
    title:     'Town Administrator',
    subtitle:  'M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm',
    order:     2,
    officials: [
      official({ name: 'Joan Lewis', role: 'Town Administrator', phone: '413-662-2448 ext. 0', email: 'TownAdmin@TownOfFlorida.org', hours: 'M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm' }),
    ],
  },
  {
    _id:       'department-school',
    _type:     'department',
    anchorId:  'school',
    category:  'services',
    icon:      'school',
    title:     'Abbott Memorial School',
    subtitle:  '56 North County Road, Florida MA 01247',
    order:     3,
    officials: [
      official({ name: 'Griffin Labbance', role: 'Principal',      phone: '(413) 664-6023', email: 'glabbance@abbottmemorial.org', address: '56 North County Road, Florida MA 01247' }),
      official({ name: 'John Franzoni',    role: 'Superintendent', phone: '(413) 664-9292', email: 'jfranzoni@nbsunion.com',       address: 'Northern Berkshire School Union\n26 Union Street, Suite 1A, North Adams MA 01247' }),
    ],
  },
  {
    _id:       'department-accountant',
    _type:     'department',
    anchorId:  'accountant',
    category:  'admin',
    icon:      'briefcase',
    title:     'Town Accountant',
    order:     4,
    officials: [
      official({ name: 'Rebecca Choquette', role: 'Town Accountant', phone: '413-662-2448 ext. 1', email: 'Accountant@TownOfFlorida.org' }),
    ],
  },
  {
    _id:       'department-assessors',
    _type:     'department',
    anchorId:  'assessors',
    category:  'elected',
    icon:      'home',
    title:     'Board of Assessors',
    subtitle:  'Meets every other Monday Evening at 6:00pm · (413) 662-2448 ext. 2 · Assessors@TownOfFlorida.org',
    order:     5,
    officials: [
      official({ name: 'Krista Bishop',  role: 'Board of Assessor & Clerk', phone: '(413) 662-2448 ext. 2', email: 'Assessors@TownOfFlorida.org', notes: 'Board meets every other Monday Evening at 6:00pm' }),
      official({ name: 'Lawrence Cote',  role: 'Board of Assessor' }),
      official({ name: 'Susan Bedini',   role: 'Board of Assessors' }),
    ],
  },
  {
    _id:       'department-health',
    _type:     'department',
    anchorId:  'health',
    category:  'elected',
    icon:      'heart',
    title:     'Board of Health',
    subtitle:  'Meets 4th Tuesday of the month at 3:30pm · (413) 662-2448 ext. 0',
    order:     6,
    officials: [
      official({ name: 'Alfred Bedini, Sr.', role: 'Board of Health Chair', phone: '(413) 662-2448 extension 0', notes: 'Meets 4th Tuesday of the month at 3:30pm' }),
      official({ name: 'Neil Oleson',        role: 'Board of Health' }),
      official({ name: 'Heidi Dugal',        role: 'Board of Health' }),
    ],
  },
  {
    _id:       'department-building',
    _type:     'department',
    anchorId:  'building',
    category:  'inspectors',
    icon:      'tool',
    title:     'Building Inspector & Zoning Board Inspector',
    order:     7,
    officials: [
      official({ name: 'Brenda Jean Church', role: 'Building and Zoning Board Inspector', phone: '413-548-6633', email: 'bchurch123@gmail.com', notes: 'Leave a message with your contact information and phone number.\n\nPermit fee: $10.00 per $1,000.00 of total project cost, with a minimum of $80.00.\nMake checks payable to: Town of Florida' }),
    ],
  },
  {
    _id:       'department-coa',
    _type:     'department',
    anchorId:  'coa',
    category:  'services',
    icon:      'users',
    title:     'Council on Aging — Senior Center',
    subtitle:  'Wed, Thurs, Friday 9:00am–3:00pm · (413) 662-2448 ext. 4 · CouncilOnAging@TownOfFlorida.org',
    order:     8,
    officials: [
      official({ name: 'Sue Oleson',       role: 'Senior Center Director', phone: '(413) 662-2448 ext. 4', email: 'CouncilOnAging@TownOfFlorida.org', hours: 'Wed, Thurs, Friday 9:00am–3:00pm' }),
      official({ name: 'Joyce Van Tilborg', role: 'Assistant Director' }),
    ],
  },
  {
    _id:       'department-electrical',
    _type:     'department',
    anchorId:  'electrical',
    category:  'inspectors',
    icon:      'zap',
    title:     'Electrical Wiring Inspector',
    subtitle:  'Permit: Residential $55.00 · Commercial $105.00',
    order:     9,
    officials: [
      official({ name: 'Timothy Keating',    role: 'Electrical Wiring Inspector',           phone: '(413) 663-1659', notes: 'Permit — Residential: $55.00 · Commercial: $105.00' }),
      official({ name: 'Nickolas C. Keating', role: 'Assistant Electrical Wiring Inspector', phone: '413-281-7672',  notes: 'Permit — Residential: $55.00 · Commercial: $105.00' }),
    ],
  },
  {
    _id:       'department-library',
    _type:     'department',
    anchorId:  'library',
    category:  'services',
    icon:      'book',
    title:     'Florida Free Library',
    subtitle:  '56 North County Road, Florida MA 01247 · (413) 664-0153',
    order:     10,
    officials: [
      official({ name: 'Heidi Dugal', role: 'Director', phone: '(413) 664-0153', email: 'Director@FloridaFreeLibrary.com', address: '56 North County Road, Florida MA 01247' }),
    ],
  },
  {
    _id:       'department-fire',
    _type:     'department',
    anchorId:  'fire',
    category:  'safety',
    icon:      'fire',
    title:     'Florida Volunteer Fire Department',
    subtitle:  '139 Mohawk Trail, Florida MA 01247 · Burn Permits: Tuesday Nights 6pm–9pm',
    order:     11,
    officials: [
      official({ name: 'Michael Gleason', role: 'Chief', phone: '(413) 662-2448 ext. 6', email: 'MikeFVFD@gmail.com', address: '139 Mohawk Trail, Florida MA 01247', notes: 'BURN PERMITS available Tuesday Nights 6pm–9pm' }),
    ],
  },
  {
    _id:       'department-highway',
    _type:     'department',
    anchorId:  'highway',
    category:  'services',
    icon:      'truck',
    title:     'Highway Department',
    subtitle:  'Hours: 7:00am–3:30pm · (413) 662-2448 ext. 5 · Cell: 413-664-1691',
    order:     12,
    officials: [
      official({ name: 'James White',        role: 'Highway Supervisor', phone: '(413) 662-2448 ext. 5', email: 'Highway@TownOfFlorida.org', hours: '7:00am–3:30pm', notes: 'Cell: 413-664-1691' }),
      official({ name: 'Michael Gleason',    role: 'Highway' }),
      official({ name: 'Michael Worth',      role: 'Highway' }),
      official({ name: 'Christopher Sahady', role: 'Highway' }),
    ],
  },
  {
    _id:       'department-police',
    _type:     'department',
    anchorId:  'police',
    category:  'safety',
    icon:      'shield',
    title:     'Police Department',
    subtitle:  'For emergencies, always dial 911',
    order:     13,
    officials: [
      official({ name: 'Massachusetts State Police — Cheshire Barracks', role: 'Police Department', phone: '413-743-4700', notes: 'For Emergencies: DIAL 911\n\nNon-Emergencies and Police Reporting:\nCall Cheshire Barracks Mass State Police' }),
    ],
  },
  {
    _id:       'department-town-clerk',
    _type:     'department',
    anchorId:  'town-clerk',
    category:  'admin',
    icon:      'file',
    title:     'Town Clerk',
    subtitle:  'Wednesday Evenings 6:00pm–7:30pm · (413) 662-2448 ext. 3',
    order:     14,
    officials: [
      official({ name: 'Lisa H. Brown', role: 'Town Clerk', phone: '(413) 662-2448 ext. 3', email: 'Clerk@TownOfFlorida.org', hours: 'Wednesday Evenings 6:00pm–7:30pm' }),
    ],
  },
  {
    _id:       'department-tax-collector',
    _type:     'department',
    anchorId:  'tax-collector',
    category:  'admin',
    icon:      'credit-card',
    title:     'Tax Collector',
    subtitle:  'First and Third Wednesday of the month, 4:30pm–6:00pm',
    order:     15,
    officials: [
      official({ name: 'Stephanie Pare', role: 'Tax Collector', phone: '(413) 464-1449', email: 'TaxCollector@TownOfFlorida.org', hours: 'Office Hours: First and Third Wednesday, 4:30pm–6:00pm', links: [
        link('Online Payments: paymybills.link/floridama', 'https://paymybills.link/floridama'),
        link('Deputy Tax Collection: www.kelleyryan.com',  'https://www.kelleyryan.com'),
      ]}),
    ],
  },
  {
    _id:       'department-treasurer',
    _type:     'department',
    anchorId:  'treasurer',
    category:  'admin',
    icon:      'database',
    title:     'Treasurer',
    subtitle:  'Office Hours: Wednesday evenings 5:30pm–7:30pm',
    order:     16,
    officials: [
      official({ name: 'Stacy Abuisi', role: 'Treasurer', phone: '413-662-2448 ext. 1', email: 'Treasurer@TownOfFlorida.org', hours: 'Wednesday evenings 5:30pm–7:30pm' }),
    ],
  },
  {
    _id:       'department-veterans',
    _type:     'department',
    anchorId:  'veterans',
    category:  'services',
    icon:      'award',
    title:     "Veterans' Services Officer",
    subtitle:  'District Director of Northern Berkshire County',
    order:     17,
    officials: [
      official({ name: 'Kurtis Durocher', role: "Veterans' Services Officer / District Director of Northern Berkshire County", phone: 'Office: (413) 662-3040', email: 'kdurocher@northadams-ma.gov', address: "City of North Adams Veterans' Office\n10 Main St, Room 101, North Adams, MA 01247", notes: 'Cell: (413) 672-5163' }),
    ],
  },
]

async function run() {
  console.log(`Migrating ${DEPARTMENTS.length} departments to Sanity...`)
  for (const dept of DEPARTMENTS) {
    await client.createOrReplace(dept)
    console.log(`  ✓ ${dept.title}`)
  }
  console.log('\nAll departments migrated successfully.')
}

run().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
