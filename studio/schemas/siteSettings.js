export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],   // singleton — no create/delete
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Browser tab / SEO title. e.g. Town of Florida, MA — Official Website',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Short SEO description shown in search results.'
    },
    {
      name: 'townName',
      title: 'Town Name',
      type: 'string',
      initialValue: 'Town of Florida',
      validation: Rule => Rule.required()
    },
    {
      name: 'state',
      title: 'State',
      type: 'string',
      initialValue: 'Massachusetts'
    },
    {
      name: 'address',
      title: 'Mailing Address',
      type: 'string',
      description: 'e.g. 379 Mohawk Trail, Drury, MA 01343'
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'e.g. (413) 662-2448'
    },
    {
      name: 'email',
      title: 'Town Hall Email',
      type: 'string',
      description: 'e.g. townhall.floridamass@gmail.com'
    },
    {
      name: 'hours',
      title: 'Town Hall Hours',
      type: 'string',
      description: 'e.g. M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm'
    }
  ]
}
