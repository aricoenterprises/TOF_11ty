/**
 * Shared Sanity client for Eleventy data files.
 * Project ID is public — token is kept in .env
 */
const { createClient } = require('@sanity/client')

module.exports = createClient({
  projectId: 'hs5p5cc4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,   // always fresh data at build time
})
