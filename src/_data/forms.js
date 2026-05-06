const client = require('./sanityClient')

module.exports = async function () {
  try {
    const forms = await client.fetch(`
      *[_type == "form"] | order(order asc) {
        title,
        description,
        "url": url,
        iconType
      }
    `)
    if (forms && forms.length > 0) return { forms }
  } catch (err) {
    console.warn('[Sanity] forms.js fetch failed, using fallback:', err.message)
  }

  // Fallback — mirrors original forms.json
  return {
    forms: [
      {
        title: 'Address Change',
        description: 'Update your address on file with the Town of Florida.',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_668c4388c1d02.pdf',
        iconType: 'home',
      },
      {
        title: 'Building Permit Application',
        description: 'Required for new construction, additions, and renovations. Fee: $10 per $1,000 of cost (min. $80).',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_5d2f7a395d79b.pdf',
        iconType: 'tool',
      },
      {
        title: 'Electrical Permit Application',
        description: 'Required for all electrical work. Residential: $55 · Commercial: $105. Contact Tim Keating: (413) 663-1659.',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_641deced9848b.pdf',
        iconType: 'zap',
      },
      {
        title: 'Plumbing Permit Application',
        description: 'Required for all plumbing work. Contact John Vareschi, Vareschi Plumbing & Heating: (413) 664-6416.',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_5d2f7a642e4ed.pdf',
        iconType: 'tool',
      },
      {
        title: 'Massachusetts Firearms Permit (LTC / FID)',
        description: 'Resident application for a License to Carry or FID card. Fee: $100. Contact David Burdick: (413) 347-0917.',
        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6988d6782a442.pdf',
        iconType: 'shield',
      },
    ],
  }
}
