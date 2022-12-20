'use client'
import { useEffect, useState } from 'react'
import styles from '../../styles/Scrape.module.css'

const nameRegex = /New order from:\s\w+\s\w+/
const phoneRegex = /\(\d{3}\)\s\d{3}-\d{4}/
const emailRegex = /[\w.]+@[\w.]+\.\w+/
const orderRegex = /Order:\s\w+/
const dateRegex = /Date:\s\d+-\d+-\d+/
const shippingRegex = /Shipping Address([^]*?)Billing Address/
const billingRegex = /Billing Address([^]*?)Shipping Method/
//city type one: CITY: San Antonio
//city type two: CITY: Austin
const orderCityRegex = /CITY:\s\w+\s\w+/ || /CITY:\s\w+/
const orderPlanRegex = /PLAN:\s\w+/
const orderTermRegex = /TERM:\s\w+/
const orderStatusRegex = /STATUS:\s\w+/
//SKU type one: MEM-SAN-PLY-NNL-YRL
//SKU type two: MEM-SAN-PLY-NNL-YRL8
const skuRegexOne = /SKU:\s\w+-\w+-\w+-\w+-\w+/
const skuRegexTwo = /SKU:\s\w+-\w+-\w+-\w+-\w+\d/
const orderSubTotalRegex = /Subtotal:\s\$\d+\.\d+/
const orderShippingPlusTaxRegex = /Shipping \(Ships Free\):\s\$\d+\.\d+/
const orderSalesTaxRegex = /Sales Tax 8.25%:\s\$\d+\.\d+/
const orderOrderTotalRegex = /Order Total:\s\$\d+\.\d+/

type Order = {
  name: string
  phone: string
  email: string
  OrderNumber: string
  OrderDate: string
  ShippingAddress: string
  BillingAddress: string
  Order: {
    City: string
    Plan: string
    Term: string
    Status: string
    SKU: string
    SubTotal: string
    ShippingPlusTax: string
    SalesTax: string
    OrderTotal: string
  }
}

export default function Page() {
  const [scrapeInputValues, setScrapeInputValues] = useState('')
  const [scrapeValues, setScrapeValues] = useState<Order>({
    name: '',
    phone: '',
    email: '',
    OrderNumber: '',
    OrderDate: '',
    ShippingAddress: '',
    BillingAddress: '',
    Order: {
      City: '',
      Plan: '',
      Term: '',
      Status: '',
      SKU: '',
      SubTotal: '',
      ShippingPlusTax: '',
      SalesTax: '',
      OrderTotal: '',
    },
  })
  const [outputText, setOutputText] = useState('')

  const inputHandler = (event: any) => {
    setScrapeInputValues(event.target.value)
  }

  const scrapeHandler = () => {
    const scrapeOne = scrapeInputValues
      .replace('|', ' ')
      .replace(/[\r\n\t\x0B\x0C\u0085\u2028\u2029]+/g, ' ')

    const name = scrapeOne.match(nameRegex)
    const phone = scrapeOne.match(phoneRegex)
    const email = scrapeOne.match(emailRegex)
    const order = scrapeOne.match(orderRegex)
    const date = scrapeOne.match(dateRegex)
    const shipping = scrapeOne.match(shippingRegex)
    const billing = scrapeOne.match(billingRegex)
    const orderCity = scrapeOne.match(orderCityRegex)
    const orderPlan = scrapeOne.match(orderPlanRegex)
    const orderTerm = scrapeOne.match(orderTermRegex)
    const orderStatus = scrapeOne.match(orderStatusRegex)
    const orderSKU = scrapeOne.match(skuRegexOne) || scrapeOne.match(skuRegexTwo)
    const orderSubTotal = scrapeOne.match(orderSubTotalRegex)
    const orderShippingPlusTax = scrapeOne.match(orderShippingPlusTaxRegex)
    const orderSalesTax = scrapeOne.match(orderSalesTaxRegex)
    const orderOrderTotal = scrapeOne.match(orderOrderTotalRegex)

    setScrapeValues(
      Object.assign({}, scrapeValues, {
        name: name ? name[0].replace('New order from:', '') : '',
        phone: phone ? phone[0] : '',
        email: email ? email[0] : '',
        OrderNumber: order ? order[0].replace('Order:', '') : '',
        OrderDate: date ? date[0].replace('Date: ', '') : '',
        ShippingAddress: shipping
          ? shipping[0]
              .replace('Shipping Address', '')
              .replace('Billing Address', '')
          : '',
        BillingAddress: billing
          ? billing[0].replace('Billing Address', '').replace('Shipping Method', '')
          : '',
        Order: {
          City: orderCity ? orderCity[0].replace('CITY: ', '') : '',
          Plan: orderPlan ? orderPlan[0].replace('PLAN: ', '') : '',
          Term: orderTerm ? orderTerm[0].replace('TERM: ', '') : '',
          Status: orderStatus ? orderStatus[0].replace('STATUS: ', '') : '',
          SKU: orderSKU ? orderSKU[0].replace('SKU: ', '') : '',
          SubTotal: orderSubTotal ? orderSubTotal[0].replace('Subtotal: ', '') : '',
          ShippingPlusTax: orderShippingPlusTax
            ? orderShippingPlusTax[0].replace('Shipping (Ships Free): ', '')
            : '',
          SalesTax: orderSalesTax
            ? orderSalesTax[0].replace('Sales Tax 8.25%: ', '')
            : '',
          OrderTotal: orderOrderTotal
            ? orderOrderTotal[0].replace('Order Total: ', '')
            : '',
        },
      })
    )
  }
  useEffect(() => {
    setOutputText(
      'scrapedData:' +
        '\n' +
        'name: ' +
        scrapeValues.name +
        '\n' +
        'phone: ' +
        scrapeValues.phone +
        '\n' +
        'email: ' +
        scrapeValues.email +
        '\n' +
        'orderNumber: ' +
        scrapeValues.OrderNumber +
        '\n' +
        'orderDate: ' +
        scrapeValues.OrderDate +
        '\n' +
        'shippingAddress: ' +
        scrapeValues.ShippingAddress +
        '\n' +
        'billingAddress: ' +
        scrapeValues.BillingAddress +
        '\n' +
        'city: ' +
        scrapeValues.Order.City +
        '\n' +
        'plan: ' +
        scrapeValues.Order.Plan +
        '\n' +
        'term: ' +
        scrapeValues.Order.Term +
        '\n' +
        'status: ' +
        scrapeValues.Order.Status +
        '\n' +
        'sku: ' +
        scrapeValues.Order.SKU +
        '\n' +
        'subTotal: ' +
        scrapeValues.Order.SubTotal +
        '\n' +
        'shippingPlusTax: ' +
        scrapeValues.Order.ShippingPlusTax +
        '\n' +
        'salesTax: ' +
        scrapeValues.Order.SalesTax +
        '\n' +
        'orderTotal: ' +
        scrapeValues.Order.OrderTotal
    )
  }, [scrapeValues])

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.scrapeTitle}>Copy and paste email below.</h1>
      <div className={styles.scrapeWrapper}>
        <textarea
          className={styles.scrapeInput}
          id={'input'}
          onKeyUp={inputHandler}
        ></textarea>
        <button
          value={'Scrape'}
          className={styles.scrapeButton}
          onClick={scrapeHandler}
        >
          Scrape
        </button>
        <textarea
          id={'output'}
          value={outputText}
          className={styles.scrapeOutput}
          onChange={(event) => setOutputText(event.target.value)}
        ></textarea>
      </div>
      <h1>TODO: Add a button to verify that the ouput is correct.</h1>
      <h1>If it is, then add the data to the database. </h1>
      <h1>First lets make sure that this works correctly with a few emails.</h1>
    </div>
  )
}
