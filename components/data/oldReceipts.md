'use client'

import { db } from '../../firebase/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import styles from '../../styles/GoDaddy.module.css'
import type { Order } from '../../types/order'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
type GoDaddyProduct = Record<string, string>
export type GoDaddyDoc = {
  firstName?: string
  lastName?: string
  name: string
  phone: string
  email: string
  billingAddress: string
  orderNumber: string
  date: string
  shippingAddress: string
  specialInstructions: string
  products: GoDaddyProduct[]
  subTotal: string
  salesTax: string
  orderTotal: string
}
type CombinedKeys<T, U> = {
  [K in keyof T | keyof U]?: K extends keyof T
    ? K extends keyof U
      ? CombinedKeys<T[K], U[K]> // Recursive case for nested types
      : T[K]
    : K extends keyof U
    ? U[K]
    : never // Base case for non-nested types
}
type OrderWithMetaData = CombinedKeys<Order, GoDaddyDoc>

export const Receipts = () => {
  const [data, setData] = useState<OrderWithMetaData[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)
  const [totalSales, setTotalSales] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [totalSubtotal, setTotalSubtotal] = useState(0)
  const [screenWidth, setScreenWidth] = useState(365)
  const [screenHeight, setScreenHeight] = useState(500)
  const [gridApi, setGridApi] = useState<any>(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridOptions, setGridOptions] = useState<any>(null)
  const [totalsColumnDefs, setTotalsColumnDefs] = useState([
    { field: 'totalSubtotal' },
    { field: 'totalTax' },
    { field: 'totalSales' },
  ])
  const [totalsData, setTotalsData] = useState([] as any)
  const gridRef = useRef<AgGridReact>(null)

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
    setGridOptions(params.gridOptions)

    params.columnApi.autoSizeAllColumns()
  }

  const isKeyInArr = (arr: any, key: any) => {
    return arr.find((item: any) => {
      if (Object.keys(item).includes(key) === true) return item
    })
  }

  const valueGetter = (params: any) => {
    const val = params.data[params.colDef.field]
    if (val === undefined) return
    if (val === null) return
    if (val === '') return
    if (val.length === 0) return
    return val.trim()
  }

  const valueGetterMetaData = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    return params.data.metaData[params.colDef.field]
  }
  const valueGetterMetaDataSelects = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    if (arr === undefined) return
    if (arr === null) return
    if (arr === '') return
    const str = arr.map((item: Record<string, string>) => {
      const key = Object.keys(item)[0]
      return `${key}: ${item[key]}`
    })
    return str.join(', ')
  }

  const valueGetterMetaDataQs = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.qs
    if (arr === undefined) return
    if (arr === null) return
    if (arr === '') return
    const str = arr.map((item: Record<string, string>) => {
      const key = Object.keys(item)[0]
      return `${key}: ${item[key]}`
    })
    return str.join(', ')
  }

  const valueGetterSideGames = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'sidegames')

    return find ? find.sidegames : ''
  }

  const valueGetterTeeChoice = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'teechoice')

    return find ? find.teechoice : ''
  }

  const valueGetterTeeTime = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'teetime')

    return find ? find.teetime : ''
  }

  const valueGetterSkins = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'skins')

    return find ? find.skins : ''
  }
  const valueGetterPlayingPartnerRequest = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'playingpartnerrequest')

    return find ? find.playingpartnerrequest : ''
  }
  const valueGetterRideOrWalk = (params: any) => {
    if (params.data.metaData === undefined) return
    if (params.data.metaData === null) return
    if (params.data.metaData === '') return
    const arr: any = params.data.metaData.selects
    const find = isKeyInArr(arr, 'rideorwalk')

    return find ? find.rideorwalk : ''
  }

  const valueSetter = (params: any) => {
    params.data[params.colDef.field] = params.newValue
    UpdateDB(params.data, params.newValue)
    return true
  }

  const UpdateDB = (data: any, newValue: any) => {
    try {
      fetch('/api/firebase/updateGoDaddyData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
        }),
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight: any, cellValue: any) => {
          if (cellValue === undefined) return
          if (cellValue === null) return
          if (cellValue === '') return
          if (cellValue.includes('/')) return
          if (cellValue.includes('-')) cellValue = cellValue.replace(/-/g, '/')
          const dateParts = cellValue.split('/')
          const cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[0]) - 1,
            Number(dateParts[1])
          )
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1
          }
        },
      },

      valueGetter: valueGetter,
      valueSetter: valueSetter,
      valueFormatter: (params: any) => {
        if (params.value === undefined) return
        if (params.value === null) return
        if (params.value === '') return
        if (params.value.includes('/')) return params.value
        if (params.value.includes('-'))
          params.value = params.value.replace(/-/g, '/')

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
      headerName: 'Name',
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
      headerName: 'Side Games',
      field: 'sidegames',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterSideGames,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Tee Choice',
      field: 'teechoice',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterTeeChoice,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Tee Time',
      field: 'teetime',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterTeeTime,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Skins',
      field: 'skins',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterSkins,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Playing Partner Request',
      field: 'playingpartnerrequest',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterPlayingPartnerRequest,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Ride / Walk',
      field: 'rideorwalk',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterRideOrWalk,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      headerName: 'SKU',
      field: 'sku',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Sub Total',
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
      headerName: 'Sales Tax',
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
      headerName: 'Order Total',
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
      headerName: 'Coupon',
      field: 'coupon',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterMetaData,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Form Options',
      field: 'selects',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterMetaDataSelects,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Form Questions',
      field: 'qs',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterMetaDataQs,
      valueSetter: valueSetter,
    },
  ])

  const [membershipColumnDefs, setMembershipColumnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      filter: 'agDateColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
      valueFormatter: (params: any) => {
        if (params.value === undefined) return
        if (params.value === null) return
        if (params.value === '') return
        if (params.value.includes('/')) return params.value
        if (params.value.includes('-'))
          params.value = params.value.replace(/-/g, '/')

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
      headerName: 'Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      headerName: 'SKU',
      field: 'sku',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      headerName: 'Sub Total',
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
      headerName: 'Sales Tax',
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
      headerName: 'Order Total',
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
      headerName: 'Coupon',
      field: 'coupon',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetterMetaData,
      valueSetter: valueSetter,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      resizable: true,
      sortable: true,
      filter: true,
      editable: true,
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setScreenWidth(365)
      } else if (window.innerWidth >= 500 && window.innerWidth < 700) {
        setScreenWidth(500)
      } else if (window.innerWidth >= 700 && window.innerWidth < 1000) {
        setScreenWidth(700)
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1300) {
        setScreenWidth(1000)
      } else if (window.innerWidth >= 1300 && window.innerWidth < 1600) {
        setScreenWidth(1300)
      } else if (window.innerWidth >= 1600 && window.innerWidth < 2000) {
        setScreenWidth(1600)
      } else {
        setScreenWidth(2000)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 500) {
        setScreenHeight(500)
      } else if (window.innerHeight >= 500 && window.innerHeight < 700) {
        setScreenHeight(500)
      } else if (window.innerHeight >= 700 && window.innerHeight < 1000) {
        setScreenHeight(700)
      } else if (window.innerHeight >= 1000 && window.innerHeight < 1300) {
        setScreenHeight(1000)
      } else if (window.innerHeight >= 1300 && window.innerHeight < 1600) {
        setScreenHeight(1300)
      } else if (window.innerHeight >= 1600 && window.innerHeight < 2000) {
        setScreenHeight(1600)
      } else {
        setScreenHeight(2000)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    console.log('setting data')

    if (data.length > 0) {
      let tax = 0.0
      let subtotal = 0.0
      data.forEach((item) => {
        item.salesTax
          ? //@ts-ignore
            (tax += item.salesTax.length > 0 ? Number(item.salesTax) : 0)
          : (tax += 0)
        item.subTotal
          ? //@ts-ignore
            (subtotal += Number(item.subTotal.replace(/[^0-9.-]+/g, '')))
          : (subtotal += 0)
      })
      tax = Math.round(tax * 100) / 100
      subtotal = Math.round(subtotal * 100) / 100

      setTotalSales(tax + subtotal)
      setTotalTax(tax)
      setTotalSubtotal(subtotal)
      setTotalsData([
        {
          totalSubtotal: `$${subtotal}`,
          totalTax: `$${tax}`,
          totalSales: `$${tax + subtotal}`,
        },
      ])
      if (gridApi) {
        const colDefs = gridApi.api.getColumnDefs()
        colDefs.length = 0
        const keys = Object.keys(data[0])
        keys.forEach((key) => {
          colDefs.push({ field: key })
        })
        setColumnDefs(colDefs)
        gridApi.api.setColumnDefs(colDefs)
        gridApi.api.setRowData(data)
      }
    }
  }, [data])

  useEffect(() => {
    if (user && loading) {
      const getOrdersFromFirebase = async () => {
        const colRef = collection(db, 'goDaddy')
        const querySnapshot = await getDocs(colRef)
        const data: any = []
        querySnapshot.forEach(async (doc) => {
          const receipt = doc.data()
          data.push(receipt)
        })
        setData(data)
      }
      getOrdersFromFirebase()
      setLoading(false)
    }
  }, [user])

  return (
    <>
      {loading || data.length === 0 || totalsData.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          <div className={styles.totalsGridWrapper}>
            <div
              className="ag-theme-alpine"
              style={{ width: screenWidth, height: 100 }}
            >
              <AgGridReact
                rowData={totalsData}
                columnDefs={totalsColumnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
          <div className={styles.totalsGridWrapper}>
            <input
              type="button"
              value="Export to CSV"
              onClick={() => {
                gridApi ? gridApi.exportDataAsCsv() : null
              }}
            />
            <input
              type="button"
              value="Membership Table"
              onClick={() => {
                gridApi ? gridApi.setColumnDefs(membershipColumnDefs) : null
              }}
            />
            <input
              type="button"
              value="All Orders"
              onClick={() => {
                gridApi ? gridApi.setColumnDefs(columnDefs) : null
              }}
            />
          </div>
          <div className={styles.gridWrapper}>
            <div
              className="ag-theme-alpine"
              style={{
                width: screenWidth,
                height: screenHeight,
                boxShadow: '5px 5px 10px 0 rgba(0,0,0,0.2)',
                border: '1px solid rgba(0,0,0,0.2)',
                overflowX: 'scroll',
                whiteSpace: 'nowrap',
              }}
            >
              <AgGridReact
                onGridReady={onGridReady}
                ref={gridRef}
                rowData={data}
                //@ts-ignore
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
