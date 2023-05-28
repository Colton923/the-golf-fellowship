'use client'

import { db } from '../../firebase/firebaseClient'
import {
  collection,
  getDocs,
  where,
  query,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  QueryConstraint,
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
import { ColDef, GridApi } from 'ag-grid-community'
import ExpandCollapseCellRenderer from './ExpandCollapseCellRenderer'

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
  const [totalsColumnDefs, setTotalsColumnDefs] = useState([
    { field: 'totalSubtotal' },
    { field: 'totalTax' },
    { field: 'totalSales' },
  ])
  const [totalsData, setTotalsData] = useState([] as any)
  const gridRef = useRef<AgGridReact>(null)
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([])
  const [queryObj, setQueryObj] = useState<FormData>({})
  const [uniqueProds, setUniqueProds] = useState<string[]>(['sku'])

  const onGridReady = useCallback((params: any) => {
    if (!params.api) return
    setGridApi(params.api)
  }, [])

  const onFirstDataRendered = useCallback((params: any) => {
    const { columnApi } = params
    columnApi.autoSizeAllColumns()
    columnApi.setColumnGroupOpened('products', false)
  }, [])

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
    if (newProduct.includes('\n')) {
      newProduct.replace('\n', ' ')
    }
    if (newProduct.includes('\r')) {
      newProduct.replace('\r', ' ')
    }
    if (newProduct.includes('\t')) {
      newProduct.replace('\t', ' ')
    }
    uniqueProds.push(newProduct)
    setUniqueProds(uniqueProds)
  }

  // const UpdateDB = (data: any, newValue: any) => {
  //   try {
  //     fetch('/api/firebase/updateGoDaddyData', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         data,
  //       }),
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      resizable: true,
      sortable: true,
      filter: true,
      editable: true,
      cellStyle: (params: any) => {
        if (params.data !== undefined && params.data !== null) {
          if (params.data.shippingAddress !== undefined) {
            return {
              display: 'flex',
              fontSize: '13px',
              lineHeight: '1.2',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              textAlign: 'center',
              alignItems: 'center',
              padding: '3px',
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
  useEffect(() => {
    if (user) {
      const getOrdersFromFirebase = async () => {
        const colRef = collection(db, 'goDaddy')

        if (!queryObj.fromDate) return
        if (!queryObj.toDate) return
        const newFromDate = FixQueryDate(queryObj.fromDate.toString())
        const newToDate = FixQueryDate(queryObj.toDate.toString())
        const queryConstraints: QueryConstraint[] = []
        if (newFromDate) {
          queryConstraints.push(where('date', '>=', newFromDate))
        }
        if (newToDate) {
          queryConstraints.push(where('date', '<=', newToDate))
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
          queryConstraints.push(where('sku', '==', queryObj.sku.toString()))
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

        const queryRef = query(colRef, ...queryConstraints)
        const querySnap = await getDocs(queryRef)
        querySnap.forEach(async (doc) => {
          const receipt = doc.data()
          const receiptOrder = receipt as any
          const fixedName = FixCamelCaseName(receiptOrder.name)
          const fixedProduct = {}
          if (!receiptOrder.products) {
            // a function that pushes each key to the fixedProduct object
            if (receiptOrder.metaData) {
              Object.keys(receiptOrder.metaData).forEach((key) => {
                if (key !== 'qs' && key !== 'selects') {
                  UniqueProducts(key.toString().replace(/\r|\n/g, ''))

                  if (
                    //@ts-ignore
                    receiptOrder.metaData[key] !== undefined &&
                    //@ts-ignore
                    receiptOrder.metaData[key] !== null &&
                    //@ts-ignore
                    receiptOrder.metaData[key] !== ''
                  ) {
                    if (key === 'productName') {
                      //@ts-ignore
                      fixedProduct['name'] = receiptOrder.metaData[key].replace(
                        /\r|\n/g,
                        ''
                      )
                    } else {
                      //@ts-ignore
                      fixedProduct[key] = receiptOrder.metaData[key]
                    }
                  }
                } else if (key === 'selects') {
                  const arr = receiptOrder.metaData[key]

                  //@ts-ignore
                  arr.map((val) => {
                    //@ts-ignore
                    Object.keys(val).forEach((item) => {
                      if (val[item] === '' || val[item] === undefined) {
                        return
                      } else {
                        //@ts-ignore
                        fixedProduct[item] = val[item].replace(/\r|\n/g, '')
                        UniqueProducts(item.toString().replace(/\r|\n/g, ''))
                      }
                    })
                  })
                }
              })
              if (receiptOrder.plan) {
                //@ts-ignore
                fixedProduct['plan'] = receiptOrder.plan
              }
              if (receiptOrder.subTotal) {
                //@ts-ignore
                fixedProduct['price'] = receiptOrder.subTotal
              }
              if (receiptOrder.sku) {
                //@ts-ignore
                fixedProduct['sku'] = receiptOrder.sku
              }
              if (receiptOrder.status) {
                //@ts-ignore
                fixedProduct['status'] = receiptOrder.status
              }
              if (receiptOrder.term) {
                //@ts-ignore
                fixedProduct['term'] = receiptOrder.term
              }
            }
            if (receiptOrder.billingAddress?.includes('ShippingMethod')) {
              const splitAddress =
                receiptOrder.billingAddress.split('ShippingMethod')
              const billingAddress = splitAddress[0]
              receiptOrder.billingAddress = billingAddress
            }
            if (fixedName?.firstName === fixedName?.lastName) {
              if (fixedName?.firstName) {
                const numCaps = (fixedName.firstName.match(/[A-Z]/g) || []).length
                if (numCaps === 2) {
                  // index of second capital letter in string example: 'JohnSmith'
                  const splitIndex = fixedName.firstName
                    .split('')
                    .slice(1)
                    .findIndex((char) => char === char.toUpperCase())
                  // split string at index of second capital letter
                  const splitName = [
                    fixedName.firstName.slice(0, splitIndex + 1),
                    fixedName.firstName.slice(splitIndex + 1),
                  ]
                  if (splitName[0] && splitName[1]) {
                    fixedName.firstName = splitName[0]
                    fixedName.lastName = splitName[1]
                  }
                }
              }
            }
            const newOrder: OrderWithMetaData = {
              billingAddress: receiptOrder.billingAddress
                ? receiptOrder.billingAddress.toString().replace(/\n|\r/g, '')
                : '',
              date: receiptOrder.date
                ? receiptOrder.date.toString().replace(/\n|\r/g, '')
                : '',
              email: receiptOrder.email
                ? receiptOrder.email.toString().replace(/\n|\r/g, '')
                : '',
              firstName: fixedName?.firstName
                ? fixedName.firstName.toString().replace(/\n|\r/g, '')
                : '',
              lastName: fixedName?.lastName
                ? fixedName.lastName.toString().replace(/\n|\r/g, '')
                : '',
              orderNumber: receiptOrder.orderNumber
                ? receiptOrder.orderNumber.toString().replace(/\|/g, '')
                : '',
              orderTotal: receiptOrder.orderTotal
                ? receiptOrder.orderTotal.toString().replace(/\n|\r/g, '')
                : '',
              phone: receiptOrder.phone
                ? receiptOrder.phone.toString().replace(/\n|\r/g, '')
                : '',
              products: [{ ...fixedProduct }],
              salesTax: receiptOrder.salesTax
                ? receiptOrder.salesTax.toString().replace(/\n|\r/g, '')
                : '',
              shippingAddress: receiptOrder.shippingAddress
                ? receiptOrder.shippingAddress.toString().replace(/\n|\r/g, '')
                : '',
              subTotal: receiptOrder.subTotal
                ? receiptOrder.subTotal.toString().replace(/\n|\r/g, '')
                : '',
            }

            const CleanOrder = (order: OrderWithMetaData) => {
              const newOrder = { ...order }
              const keys = Object.keys(newOrder)
              keys.forEach((key) => {
                //@ts-ignore
                if (newOrder[key] === undefined || newOrder[key] === null) {
                  //@ts-ignore
                  delete newOrder[key]
                }
              })
              // remove all \r and \n from all values
              const keys2 = Object.keys(newOrder)
              keys2.forEach((key) => {
                //@ts-ignore
                if (typeof newOrder[key] === 'string') {
                  //@ts-ignore
                  newOrder[key] = newOrder[key].replace(/\r|\n/gm, '')
                }
              })

              return newOrder
            }
            data.push(CleanOrder(newOrder))
          } else {
            Object.keys(receiptOrder.products).forEach((key) => {
              UniqueProducts(key.toString().replace(/\r|\n/g, ''))
            })
            if (receiptOrder.products.length > 0) {
              receiptOrder.products.forEach((product: any) => {
                const newProduct = {}
                Object.keys(product).forEach((key) => {
                  //@ts-ignore
                  newProduct[key] = product[key].toString().replace(/\r|\n/g, '')
                  UniqueProducts(key.toString().replace(/\r|\n/g, ''))
                })
              })
            }
            data.push(receiptOrder)
          }
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
    const newColumnDefs: ColDef[] = keys.map((key) => {
      if (key === 'date') {
        return {
          colId: 'date',
          field: key,
          headerName: 'Date',
          editable: true,
          sortable: true,
          filter: true,
          resizable: true,
          valueFormatter: (params) => {
            const seconds = params.value.toString().match(/seconds=(\d*)/)
            const date = new Date(Number(seconds[1]) * 1000)
            const dateString = date.toLocaleDateString('en-US').replace(/\//g, '-')
            return dateString
          },
        }
      }
      if (key === 'products') {
        return {
          headerName: 'Products',
          resizable: true,
          field: 'products',
          cellRenderer: ExpandCollapseCellRenderer,
        }
      }

      return { field: key }
    })

    const ReOrderColumnDefs = (columnDefs: ColDef[]) => {
      const newColumnDefs = [...columnDefs]
      const order = [
        'date',
        'firstName',
        'lastName',
        'products',
        'orderNumber',
        'subTotal',
        'salesTax',
        'orderTotal',
      ]
      const newColumnDefs2 = newColumnDefs.sort((a, b) => {
        if (!a.field || !b.field) return 0
        if (!order.includes(a.field) || !order.includes(b.field)) return 0

        const aIndex = order.indexOf(a.field)
        const bIndex = order.indexOf(b.field)

        return aIndex - bIndex
      })

      return newColumnDefs2
    }

    // update grid api row data
    setColumnDefs(ReOrderColumnDefs(newColumnDefs))
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
        <div className="ag-theme-alpine" style={{ width: screenWidth, height: 100 }}>
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
            onFirstDataRendered={onFirstDataRendered}
            rowHeight={75}
          />
        </div>
      </div>
    </div>
  )
}
