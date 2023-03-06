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

export const Receipts = () => {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)
  const [totalSales, setTotalSales] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [totalSubtotal, setTotalSubtotal] = useState(0)
  const [screenWidth, setScreenWidth] = useState(365)
  const [screenHeight, setScreenHeight] = useState(500)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [totalsColumnDefs, setTotalsColumnDefs] = useState([
    { field: 'totalSubtotal' },
    { field: 'totalTax' },
    { field: 'totalSales' },
  ])
  const [totalsData, setTotalsData] = useState([] as any)
  const gridRef = useRef<AgGridReact>(null)

  const valueGetter = (params: any) => {
    return params.data[params.colDef.field]
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
          orderNumber: data.orderNumber,
          orderTotal: data.orderTotal,
          sku: data.sku,
          status: data.status,
          name: data.name,
          email: data.email,
          phone: data.phone,
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          date: data.date,
          subTotal: data.subTotal,
          salesTax: data.salesTax,
          term: data.term,
          club: data.club,
          plan: data.plan,
        }),
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [columnDefs, setColumnDefs] = useState([
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
      field: 'name',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      field: 'city',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      field: 'club',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      field: 'plan',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
      valueSetter: valueSetter,
    },
    {
      field: 'term',
      filter: 'agTextColumnFilter',
      valueGetter: valueGetter,
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
    if (data.length > 0) {
      let tax = 0.0
      let subtotal = 0.0
      data.forEach((item) => {
        item.salesTax
          ? (tax += Number(item.salesTax.replace(/[^0-9.-]+/g, '')))
          : (tax += 0)
        item.subTotal
          ? (subtotal += Number(item.subTotal.replace(/[^0-9.-]+/g, '')))
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
    }
  }, [data])

  useEffect(() => {
    if (user) {
      const getOrdersFromFirebase = async () => {
        const colRef = collection(db, 'goDaddy')
        const querySnapshot = await getDocs(colRef)
        querySnapshot.forEach(async (doc) => {
          const receipt = doc.data() as Order
          setData((prev) => [...prev, receipt])
        })
      }
      getOrdersFromFirebase()
      setLoading(false)
    }
  }, [user])

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)

    params.api.sizeColumnsToFit()
    params.api.setRowData(data)
  }

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
