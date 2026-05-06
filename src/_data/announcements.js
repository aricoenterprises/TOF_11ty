const client = require('./sanityClient')

// Section metadata — same order and descriptions as the original JSON
const SECTION_META = [
  {
    id: 'latest-news',
    title: 'Latest News & Events',
    description: 'Current notices, programs, and updates from the Town of Florida.',
  },
  {
    id: 'legal-notices',
    title: 'Legal & Voter Notices',
    description: 'Official legal notices and voter information from the Town of Florida.',
  },
  {
    id: 'senior-center',
    title: 'Senior Community Center',
    description: 'Programs and events at the Florida Senior Community Center. Wed, Thurs, Friday 9am–3pm · (413) 662-2448 ext. 4',
  },
  {
    id: 'library',
    title: 'Florida Free Library',
    description: 'News and events from the Florida Free Library. 56 North County Road · (413) 664-0153',
  },
  {
    id: 'fire-dept',
    title: 'Fire Department',
    description: 'Notices and information from the Florida Volunteer Fire Department. Burn permits: Tuesday nights 6–9pm.',
  },
  {
    id: 'transfer-station',
    title: 'Transfer Station',
    description: 'Updates and information from the Florida Transfer Station.',
  },
  {
    id: 'community',
    title: 'Community Programs',
    description: 'Community events and programs for Florida residents.',
  },
  {
    id: 'town-hall',
    title: 'Town Hall Hours',
    description: 'Current Town Hall office hours and contact information.',
  },
]

module.exports = async function () {
  try {
    const docs = await client.fetch(`
      *[_type == "announcement"] | order(order asc, _createdAt desc) {
        title,
        description,
        "url": fileUrl,
        "type": fileType,
        section,
        featured
      }
    `)

    if (docs && docs.length > 0) {
      // Build sections array
      const sections = SECTION_META.map(meta => ({
        ...meta,
        items: docs.filter(d => d.section === meta.id),
      }))

      // Build featured array (items marked featured, in order)
      const featured = docs.filter(d => d.featured)

      return { featured, sections }
    }
  } catch (err) {
    console.warn('[Sanity] announcements.js fetch failed, using fallback:', err.message)
  }

  // Fallback — mirrors original announcements.json
  return {
    featured: [
      {
        title: 'Shred Day — Saturday, May 9',
        description: 'Free document shredding event for Florida residents. Details and drop-off information inside.',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69cd8fa607e83.pdf',
        type: 'pdf',
      },
      {
        title: 'Florida Free Library — Upcoming Events',
        description: 'Current events and programming at the Florida Free Library. 56 North County Road · (413) 664-0153',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69dd5411797f0.pdf',
        type: 'pdf',
      },
      {
        title: 'Rabies Clinic — April 11, 2026',
        description: 'Florida Volunteer Fire Department. Burn permits: Tuesday nights 6–9pm · Chief Michael Gleason',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69d4090dbd61a.docx',
        type: 'docx',
      },
      {
        title: 'Transfer Station — 2026 Recycling Guide',
        description: "What's accepted, what's not, and how to recycle properly at the Florida Transfer Station.",
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69d3fc7c24138.pdf',
        type: 'pdf',
      },
    ],
    sections: SECTION_META.map(meta => ({ ...meta, items: [] })),
  }
}
