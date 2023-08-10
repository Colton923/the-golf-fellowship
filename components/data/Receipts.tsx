'use client'

import { db } from '../../firebase/firebaseClient'
import {
  collection,
  getDocs,
  where,
  query,
  Timestamp,
  QueryConstraint,
  orderBy,
  limit,
} from 'firebase/firestore'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import styles from '../../styles/GoDaddy.module.css'
import type { Order } from '../../types/order'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import FormQuery from './Query'
import type { FormData } from './Query'
import { ColDef } from 'ag-grid-community'

type GoDaddyProduct = Record<string, string>
export type GoDaddyDoc = {
  firstName?: string
  lastName?: string
  name: string
  phone: string
  email: string
  billingAddress: string
  orderNumber: string
  date: Timestamp
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
  const [user] = useAuthState(auth)
  const [screenWidth, setScreenWidth] = useState(365)
  const [screenHeight, setScreenHeight] = useState(500)
  const [gridApi, setGridApi] = useState<any>(null)
  const gridRef = useRef<AgGridReact>(null)
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([])
  const [queryObj, setQueryObj] = useState<FormData>({})
  const [uniqueProds, setUniqueProds] = useState<string[]>(['sku'])
  const [pointRaces, setPointRaces] = useState<string[]>([])

  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]

  const order = [
    'date',
    'name',
    'firstName',
    'lastName',
    'sidegames',
    'SIDE GAMES',
    'teechoice',
    'TEE CHOICE',
    'teetime',
    'TEE TIME',
    'PLAYING PARTNER REQUEST',
    'playingpartner request',
    'playingPartnerRequest',
    'orderNumber',
    'subTotal',
    'salesTax',
    'orderTotal',
    'price',
  ]

  const ReOrderColumnDefs = (columnDefs: ColDef[]) => {
    const firstDefs = columnDefs.filter((col) => {
      //@ts-ignore
      return order.includes(col.field)
    })
    const lastDefs = columnDefs.filter((col) => {
      if (pointRaces.includes(col.field as string)) {
        return true
      }

      //@ts-ignore
      return !order.includes(col.field)
    })

    const sortedFirstDefs = firstDefs.sort((a, b) => {
      if (
        //@ts-ignore
        order.indexOf(a.field) < order.indexOf(b.field)
      ) {
        return -1
      }
      if (
        //@ts-ignore
        order.indexOf(a.field) > order.indexOf(b.field)
      ) {
        return 1
      }

      return 0
    })

    const sortedLastDefs = lastDefs.sort((a, b) => {
      if (
        //@ts-ignore
        pointRaces.includes(a.field)
      ) {
        return -1
      }
      if (
        //@ts-ignore
        pointRaces.includes(b.field)
      ) {
        return 1
      }

      return 0
    })

    return [...sortedFirstDefs, ...sortedLastDefs]
  }

  const FixCamelCaseName = (name: string) => {
    const isCamelCase = (str: string) => {
      return /^[a-z][a-zA-Z0-9]+$/.test(str)
    }
    if (!name) return
    if (name.length === 0) return
    if (isCamelCase(name)) {
      const splitName = name.split(/(?=[A-Z])/)
      return {
        firstName: splitName[0],
        lastName: splitName[1],
      }
    } else {
      return {
        firstName: name,
        lastName: name,
      }
    }
  }
  const FixQueryDate = (date: string) => {
    if (!date) return
    if (date.length === 0) return
    if (date.includes('/')) {
      const splitDate = date.split('/')
      const tempdate = new Date(
        Number(splitDate[2]),
        Number(splitDate[0]) - 1,
        Number(splitDate[1])
      )
      const from = Timestamp.fromDate(tempdate)
      return from
    } else {
      const splitDate = date.split('-')
      const tempdate = new Date(
        Number(splitDate[2]),
        Number(splitDate[0]) - 1,
        Number(splitDate[1])
      )
      const from = Timestamp.fromDate(tempdate)
      return from
    }
  }

  const onGridReady = useCallback((params: any) => {
    if (!params.api) return
    setGridApi(params.api)
  }, [])

  const onFirstDataRendered = useCallback(
    (params: any) => {
      params.columnApi.autoSizeAllColumns()
    },
    [columnDefs]
  )

  const onRowDataUpdated = useCallback(
    (params: any) => {
      const columns = params.columnApi.getColumns()
      const rowNodes = params.api.getRenderedNodes()
      if (!rowNodes) return
      columns.forEach((column: any) => {
        const isColumnEmpty = !rowNodes.some((node: any) => {
          const value = params.api.getValue(column, node)
          return typeof value !== 'undefined' && value !== null && value !== ''
        })
        if (isColumnEmpty) {
          params.columnApi.setColumnVisible(column, false)
        } else {
          params.columnApi.setColumnVisible(column, true)
        }
      })
    },
    [columnDefs]
  )

  const UniqueProducts = (products: any) => {
    const newProduct = products
    if (newProduct === undefined) return
    if (newProduct === null) return
    if (newProduct === '') return
    if (newProduct.length === 1) return
    if (typeof newProduct !== 'string') {
      const thisProductArray: any[] = products.key

      thisProductArray.forEach((prod: any) => {
        if (prod === undefined) return
        if (prod === null) return
        if (prod === '') return
        if (uniqueProds.includes(prod)) return
        uniqueProds.push(prod)
      })
      return
    }

    if (uniqueProds.includes(newProduct)) return

    if (newProduct.length === 0) return
    uniqueProds.push(newProduct)
    setUniqueProds(uniqueProds)
  }

  const UpdateDB = (data: any) => {
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

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 85,
      resizable: true,
      sortable: true,
      filter: true,
      autoHeight: true,
      editable: true,
      cellStyle: (params: any) => {
        if (params.data !== undefined && params.data !== null) {
          if (params.data.shippingAddress !== undefined) {
            return {
              display: 'flex',
              fontSize: '10px',
              lineHeight: '1',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              textAlign: 'center',
              alignItems: 'center',
              padding: '0px',
              margin: '0px',
              border: '1px',
              outline: '0px',
              boxSizing: 'border-box',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#000000',
              backgroundColor: '#ffffff',
              justifyContent: 'center',
            }
          }
        }
      },
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
    if (user) {
      const getOrdersFromFirebase = async () => {
        const colRef = collection(db, 'goDaddy')
        if (!queryObj.fromDate) return
        if (!queryObj.toDate) return
        const newFromDate = FixQueryDate(queryObj.fromDate.toString())
        const newToDate = FixQueryDate(queryObj.toDate.toString())
        const queryConstraints: QueryConstraint[] = []
        if (newFromDate && newToDate) {
          queryConstraints.push(
            where('date', '>=', newFromDate),
            where('date', '<=', newToDate),
            orderBy('date', 'desc')
          )
        }
        if (queryConstraints.length === 0) return
        if (queryObj.lastName) {
          queryConstraints.push(
            where('lastName', '==', queryObj.lastName.toString())
          )
        }
        if (queryObj.firstName) {
          queryConstraints.push(
            where('firstName', '==', queryObj.firstName.toString())
          )
        }
        if (queryObj.sku) {
          queryConstraints.push(
            where('products', 'array-contains', queryObj.sku.toString())
          )
        }
        if (queryObj.productName) {
          queryConstraints.push(
            where('products', 'array-contains', queryObj.productName.toString())
          )
        }
        if (queryObj.orderNumber) {
          queryConstraints.push(
            where('orderNumber', '==', queryObj.orderNumber.toString())
          )
        }

        if (queryObj.additionalQueryParams) {
          queryConstraints.push(
            where(
              queryObj.additionalQueryParams,
              '==',
              queryObj.additionalQueryParams.toString()
            )
          )
        }
        queryConstraints.push(limit(500))

        const queryRef = query(colRef, ...queryConstraints)
        const querySnap = await getDocs(queryRef)
        querySnap.forEach((doc) => {
          const receiptOrder = doc.data()
          let newProduct: any = {}
          let baseProduct: any = {}
          Object.keys(receiptOrder).forEach((key) => {
            if (key !== 'products') {
              if (key === 'orderNumber') {
                baseProduct[key] = receiptOrder[key]
                  .toString()
                  .replace(/\r|\n/g, '')
                  .replace(/\|/g, '')
                  .replace(/\*/g, '')
              } else if (
                key === 'subTotal' ||
                key === 'salesTax' ||
                key === 'orderTotal'
              ) {
                const amount = receiptOrder[key].toString().replace(/\r|\n/g, '')
                if (amount === '') {
                  baseProduct[key] = '$0.00'
                } else if (!amount.includes('$')) {
                  baseProduct[key] = `$${amount}`
                } else {
                  baseProduct[key] = amount
                }
              } else if (key === '') {
                baseProduct[key] = receiptOrder[key].toString().replace(/\r|\n/g, '')
              } else {
                baseProduct[key] = receiptOrder[key].toString().replace(/\r|\n/g, '')
              }
            }
          })
          Object.keys(receiptOrder).forEach((key) => {
            if (key === 'products') {
              const obj = receiptOrder.products
              obj.forEach((prod: any) => {
                Object.keys(prod).forEach((pro) => {
                  if (pro === 'price') {
                    const amount = prod[pro].toString().replace(/\r|\n/g, '')
                    if (amount === '') {
                      newProduct[pro] = '$0.00'
                    } else if (!amount.includes('$')) {
                      newProduct[pro] = `$${amount}`
                    }
                  } else {
                    newProduct[pro] = prod[pro].toString().replace(/\r|\n/g, '')
                  }
                  UniqueProducts(pro.toString().replace(/\r|\n/g, ''))
                })
              })
              data.push({ ...baseProduct, ...newProduct })
              newProduct = {}
            }
          })
          baseProduct = {}
        })

        generateColumnDefs(data)
        setData(data)
      }

      if (queryObj.fromDate && queryObj.toDate) {
        getOrdersFromFirebase()
      }
    }
  }, [queryObj])
  const generateColumnDefs = (data: OrderWithMetaData[]) => {
    if (!data) return
    if (data.length === 0) return

    const keys = Object.keys(data[0]).filter((key) => {
      if (key === 'email') return false
      if (key === 'phone') return false
      if (key === 'billingAddress') return false
      if (key === 'shippingAddress') return false

      return true
    })
    keys.map((key) => {
      UniqueProducts(key)
    })

    const newColumnDefs: ColDef[] = uniqueProds.map((key) => {
      const monthKey = months.reduce((acc, month) => {
        if (key.toLowerCase().includes(month)) {
          return key
        }
        return acc
      }, '')
      if (monthKey !== '') {
        setPointRaces((prev) => [...prev, monthKey])
        return {
          field: monthKey,
          headerName: monthKey,
          sortable: true,
          filter: true,
          resizable: true,
          autoHeight: true,
        }
      }
      switch (key) {
        case 'date':
          return {
            colId: 'date',
            field: key,
            headerName: 'Date',
            sortable: true,
            filter: true,
            resizable: true,
            autoHeight: true,
            valueFormatter: (params: any) => {
              const seconds = params.value.toString().match(/seconds=(\d*)/)
                ? params.value.toString().match(/seconds=(\d*)/)
                : ['seconds=0', '0']
              const date = new Date(Number(seconds[1]) * 1000)
              const dateString = date.toLocaleDateString('en-US').replace(/\//g, '-')
              return dateString
            },
          }
        case 'name':
          return {
            field: key,
            headerName: 'Product Name',
            sortable: true,
            filter: true,
            resizable: true,
            autoHeight: true,
          }
        case 'subTotal':
        case 'salesTax':
        case 'orderTotal':
        case 'price':
          return {
            field: key,
            headerName: key,
            sortable: true,
            resizable: true,
            autoHeight: true,
            filter: 'agNumberColumnFilter',
            comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any) => {
              if (valueA === undefined || valueB === undefined) return 0
              if (valueA === null || valueB === null) return 0
              if (valueA === '' || valueB === '') return 0
              const numA = valueA.replace(/[^0-9.-]+/g, '')
              const numB = valueB.replace(/[^0-9.-]+/g, '')
              return Number(numA) - Number(numB)
            },
          }
        case 'link':
          return {
            field: key,
            headerName: 'Link',
            sortable: true,
            resizable: true,
            autoHeight: true,
            filter: true,
            editable: false,
            cellRenderer: function (params: any) {
              return (
                <a href={params.value} target={'_blank'} rel={'noopener noreferrer'}>
                  {params.value}
                </a>
              )
            },
          }
        default:
          return {
            field: key,
            sortable: true,
            filter: true,
            resizable: true,
            autoHeight: true,
          }
      }
    })

    const newDefs = ReOrderColumnDefs(newColumnDefs)
    setColumnDefs(newDefs)
    gridApi?.setRowData(data)
  }

  const QuerySubmit = (data: FormData) => {
    setData([])
    const {
      fromDate,
      toDate,
      sku,
      productName,
      firstName,
      lastName,
      orderNumber,
      additionalQueryParams,
    } = data
    const query: any = {}
    if (fromDate) {
      query['fromDate'] = fromDate
    }
    if (toDate) {
      query['toDate'] = toDate
    }
    if (sku) {
      query['sku'] = sku
    }
    if (productName) {
      query['productName'] = productName
    }
    if (firstName) {
      query['firstName'] = firstName
    }
    if (lastName) {
      query['lastName'] = lastName
    }
    if (orderNumber) {
      query['orderNumber'] = orderNumber
    }
    if (additionalQueryParams) {
      query['additionalQueryParams'] = additionalQueryParams
    }
    setQueryObj(query)
  }

  return (
    <div className={styles.container}>
      <FormQuery submitHandler={QuerySubmit} />
      <div className={styles.totalsGridWrapper}>
        <input
          type="button"
          value="Export to CSV"
          onClick={() => {
            gridApi ? gridApi.exportDataAsCsv() : null
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '50px',
            margin: '0 auto',
            fontSize: '20px',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #fefefe',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        />
      </div>
      <div
        className={styles.gridWrapper}
        style={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          margin: '0 auto',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className="ag-theme-alpine"
          style={{
            position: 'absolute',
            left: 0,
            width: '100vw',
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
            onFirstDataRendered={onFirstDataRendered}
            rowHeight={75}
            onRowDataUpdated={onRowDataUpdated}
          />
        </div>
      </div>
    </div>
  )
}
