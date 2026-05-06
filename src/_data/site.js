const client = require('./sanityClient')

module.exports = async function () {
  try {
    const data = await client.fetch(`*[_type == "siteSettings"][0]{
      title,
      description,
      townName,
      state,
      address,
      phone,
      email,
      hours
    }`)
    if (data) return data
  } catch (err) {
    console.warn('[Sanity] site.js fetch failed, using fallback:', err.message)
  }

  // Fallback — matches original site.json values
  return {
    title: 'Town of Florida, MA — Official Website',
    description: 'Official website of the Town of Florida, Massachusetts. 379 Mohawk Trail, Drury, MA 01343.',
    townName: 'Town of Florida',
    state: 'Massachusetts',
    address: '379 Mohawk Trail, Drury, MA 01343',
    phone: '(413) 662-2448',
    email: 'townhall.floridamass@gmail.com',
    hours: 'M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm',
  }
}
