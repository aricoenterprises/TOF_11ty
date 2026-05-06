export default {
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'section', featured: 'featured' },
    prepare({ title, subtitle, featured }) {
      return {
        title: (featured ? '⭐ ' : '') + title,
        subtitle: subtitle
      }
    }
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. Shred Day — Saturday, May 9',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      name: 'fileUrl',
      title: 'File or Link URL',
      type: 'url',
      description: 'Link to the PDF, Word doc, or external page.',
      validation: Rule => Rule.required()
    },
    {
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      options: {
        list: [
          { title: 'PDF', value: 'pdf' },
          { title: 'Word Document (.docx)', value: 'docx' },
          { title: 'External Link', value: 'link' }
        ],
        layout: 'radio'
      },
      initialValue: 'pdf',
      validation: Rule => Rule.required()
    },
    {
      name: 'section',
      title: 'Section',
      type: 'string',
      description: 'Which section of the Announcements page should this appear in?',
      options: {
        list: [
          { title: 'Latest News & Events', value: 'latest-news' },
          { title: 'Legal & Voter Notices', value: 'legal-notices' },
          { title: 'Senior Community Center', value: 'senior-center' },
          { title: 'Florida Free Library', value: 'library' },
          { title: 'Fire Department', value: 'fire-dept' },
          { title: 'Transfer Station', value: 'transfer-station' },
          { title: 'Community Programs', value: 'community' },
          { title: 'Town Hall Hours', value: 'town-hall' }
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'featured',
      title: 'Show on homepage (Featured)?',
      type: 'boolean',
      description: 'Featured announcements appear at the top of the Announcements page and on the homepage.',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank to sort by date added.',
      initialValue: 99
    }
  ]
}
