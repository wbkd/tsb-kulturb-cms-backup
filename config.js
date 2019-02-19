module.exports = {
  meta: {
    description: 'webkid react starterkit',
    viewport: 'width=device-width, initial-scale=1',
    robots: 'noindex,nofollow'
  },
  url: {
    base: 'http://localhost:8000/api/v1',
    organisation: '/organisations'
  },
  table: {
    columns: [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sorter: true
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags'
      },
      {
        key: 'address',
        title: 'Adresse',
        dataIndex: 'address',
        sorter: true
      },
      {
        key: 'city',
        title: 'Stadt',
        dataIndex: 'city',
        sorter: true
      },
      {
        key: 'zipcode',
        title: 'PLZ',
        dataIndex: 'zipcode',
        sorter: true
      },
      {
        key: 'website',
        title: 'Website',
        dataIndex: 'website',
        sorter: true
      },
      {
        key: 'type',
        title: 'Typ',
        dataIndex: 'type',
        sorter: true,
        filters: [
          { text: 'Organisation', value: 'organisation' },
          { text: 'Venue', value: 'venue' },
          { text: 'Organisation and venue', value: 'organisation and venue' }
        ],
        filterMultiple: false
      }
    ]
  }
}
