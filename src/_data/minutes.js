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
            "url": coalesce(file.asset->url, fileUrl)
          }
        }
      `),
      client.fetch(`
        *[_type == "annualReport"] | order(year desc) {
          year,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
      client.fetch(`
        *[_type == "warrant"] | order(year desc) {
          year,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
      client.fetch(`
        *[_type == "agenda"] | order(date desc) {
          "year": date,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
    ])

    if (selectboard_minutes && selectboard_minutes.length > 0) {
      return { selectboard_minutes, annual_reports, warrants, agendas }
    }
  } catch (err) {
    console.warn('[Sanity] minutes.js fetch failed:', err.message)
  }

  // Hard fallback if Sanity is unreachable
  return { selectboard_minutes: [], annual_reports: [], warrants: [], agendas: [] }
}
