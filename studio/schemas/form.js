export default {
  name: 'form',
  title: 'Form / Document',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'iconType' },
    prepare({ title, subtitle }) {
      const icons = { home: '🏠', tool: '🔧', zap: '⚡', shield: '🛡️' }
      return { title: `${icons[subtitle] || '📄'} ${title}`, subtitle }
    }
  },
  fields: [
    {
      name: 'title',
      title: 'Form Title',
      type: 'string',
      description: 'e.g. Building Permit Application',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the Forms page. Include fees, contacts, etc.',
      validation: Rule => Rule.required()
    },
    {
      name: 'url',
      title: 'File URL',
      type: 'url',
      description: 'Link to the PDF or external page.',
      validation: Rule => Rule.required()
    },
    {
      name: 'iconType',
      title: 'Icon',
      type: 'string',
      description: 'Icon displayed on the Forms page card.',
      options: {
        list: [
          { title: '🏠 Home', value: 'home' },
          { title: '🔧 Tool', value: 'tool' },
          { title: '⚡ Zap', value: 'zap' },
          { title: '🛡️ Shield', value: 'shield' }
        ],
        layout: 'radio'
      },
      initialValue: 'tool',
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 99
    }
  ]
}
