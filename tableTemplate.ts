type MembershipOrdersTable = {}
type EventOrdersTable = {}
const Orders = [
  {
    field: 'date',
    filter: 'agDateColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
    valueFormatter: (params: any) => {
      if (params.value === undefined) return
      if (params.value === null) return
      if (params.value === '') return
      if (params.value.includes('/')) return params.value
      if (params.value.includes('-')) params.value = params.value.replace(/-/g, '/')

      return new Date(params.value).toLocaleDateString()
    },
    comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
      if (valueA === undefined || valueB === undefined) return
      if (valueA === null || valueB === null) return
      if (valueA === '' || valueB === '') return
      if (valueA.includes('/')) return
      if (valueA.includes('-')) valueA = valueA.replace(/-/g, '/')
      if (valueB.includes('-')) valueB = valueB.replace(/-/g, '/')
      const dateA = new Date(valueA)
      const dateB = new Date(valueB)
      return dateA.getTime() - dateB.getTime()
    },
  },
  {
    field: 'name',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
  },
  {
    field: 'productName',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetterMetaData,
    valueSetter: valueSetter,
  },
  {
    field: 'status',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
  },
  {
    field: 'sku',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
  },
  {
    field: 'subTotal',
    filter: 'agNumberColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
    comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
      if (valueA === undefined || valueB === undefined) return
      if (valueA === null || valueB === null) return
      if (valueA === '' || valueB === '') return
      const numA = valueA.replace(/[^0-9.-]+/g, '')
      const numB = valueB.replace(/[^0-9.-]+/g, '')
      return numA - numB
    },
  },
  {
    field: 'salesTax',
    filter: 'agNumberColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
    comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
      if (valueA === undefined || valueB === undefined) return
      if (valueA === null || valueB === null) return
      if (valueA === '' || valueB === '') return
      const numA = valueA.replace(/[^0-9.-]+/g, '')
      const numB = valueB.replace(/[^0-9.-]+/g, '')
      return numA - numB
    },
  },
  {
    field: 'orderTotal',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetter,
    valueSetter: valueSetter,
    comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
      if (valueA === undefined || valueB === undefined) return
      if (valueA === null || valueB === null) return
      if (valueA === '' || valueB === '') return
      const numA = valueA.replace(/[^0-9.-]+/g, '')
      const numB = valueB.replace(/[^0-9.-]+/g, '')
      return numA - numB
    },
  },
  {
    field: 'selects',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetterMetaDataArr,
    valueSetter: valueSetter,
  },
  {
    field: 'qs',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetterMetaDataArr,
    valueSetter: valueSetter,
  },
  {
    field: 'coupon',
    filter: 'agTextColumnFilter',
    valueGetter: valueGetterMetaData,
    valueSetter: valueSetter,
  },
]
