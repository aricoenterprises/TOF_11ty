export default {
  name: 'warrant',
  title: 'Town Meeting Warrant',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'year' },
    prepare({ title, subtitle }) { return { title, subtitle } }
  },
  fields: [
    {
      name: 'year',
      title: 'Year / Label',
      type: 'string',
      description: 'e.g. FY 2026  or  March 2023',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Document Title',
      type: 'string',
      description: 'e.g. FY26 Warrant (Signed)  or  FY26 ATM Results',
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
