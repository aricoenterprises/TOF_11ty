export default {
  name: 'annualReport',
  title: 'Annual Town Report',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'year' },
    prepare({ title, subtitle }) { return { title, subtitle } }
  },
  fields: [
    {
      name: 'year',
      title: 'Fiscal Year Label',
      type: 'string',
      description: 'e.g. FY 2022',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Report Title',
      type: 'string',
      description: 'e.g. Annual Town Report — FY22',
      validation: Rule => Rule.required()
    },
    {
      name: 'fileUrl',
      title: 'File URL',
      type: 'url',
      validation: Rule => Rule.required()
    }
  ]
}
