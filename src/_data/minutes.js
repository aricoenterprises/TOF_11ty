const client = require('./sanityClient')

module.exports = async function () {
  try {
    const [selectboard_minutes, annual_reports, warrants, agendas] = await Promise.all([
      client.fetch(`
        *[_type == "selectboardMinuteGroup"] | order(fy desc) {
          fy,
          "label": title,
          "open": openByDefault,
          "docs": documents[] {
            "name": meetingName,
            "type": fileType,
            "url": fileUrl
          }
        }
      `),
      client.fetch(`
        *[_type == "annualReport"] | order(year desc) {
          year,
          title,
          fileUrl
        }
      `),
      client.fetch(`
        *[_type == "warrant"] | order(year desc) {
          year,
          title,
          fileUrl
        }
      `),
      client.fetch(`
        *[_type == "agenda"] | order(date desc) {
          date,
          title,
          fileUrl
        }
      `),
    ])

    if (selectboard_minutes && selectboard_minutes.length > 0) {
      return { selectboard_minutes, annual_reports, warrants, agendas }
    }
  } catch (err) {
    console.warn('[Sanity] minutes.js fetch failed, using fallback JSON:', err.message)
  }

  // Fallback — load original minutes.json
  return require('./minutes.json')
}
