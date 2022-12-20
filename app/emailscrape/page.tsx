'use client'
import { useEffect, useState } from 'react'
import styles from '../../styles/Scrape.module.css'

//Data we are parsing example:
// New order from: James Jasso

// (512) 656-1292 | jjasso227@gmail.com

// VIEW ORDER
// Order: R527673457  |  Date: 12-18-2022
// Shipping Address
// JAMES JASSO
// 11101 COPPER SPRING DR
// AUSTIN TX 78748
// (512) 656-1292

// Billing Address
// Same as the shipping address

// Shipping Method
// Ships Free

// Order Summary
// Rs=w:400,h:400
// TGF MEMBERSHIP
// CITY: AUSTIN
// PLAN: PLAYER +
// TERM: ANNUAL yearly
// STATUS: RETURNING
// SKU: MEM-STN-PLY-NNL-YRL1
// $350.00
// Subtotal:	$350.00
// Shipping (Ships Free):	$0.00
// Sales Tax 8.25%:	$28.89
// Order Total:
// $378.89
// Selected payment method:
// Credit/Debit Card - GoDaddy Payments

// Regex for all 14 digit phone numbers '(###) ###-####'

const phoneRegex = /\(\d{3}\)\s\d{3}-\d{4}/

// Regex for email addresses

const emailRegex = /[\w.]+@[\w.]+\.\w+/

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
    console.log('scrapeOne', scrapeOne)

    const name = scrapeOne.match(/New order from:\s\w+\s\w+/)
    const phone = scrapeOne.match(phoneRegex)
    const email = scrapeOne.match(emailRegex)
    const order = scrapeOne.match(/Order:\s\w+/)
    const date = scrapeOne.match(/Date:\s\d+-\d+-\d+/)
    const shipping = scrapeOne.match(/Shipping Address([^]*?)Billing Address/)
    const billing = scrapeOne.match(/Billing Address([^]*?)Shipping Method/)
    const orderCity = scrapeOne.match(/CITY:\s\w+/)
    const orderPlan = scrapeOne.match(/PLAN:\s\w+/)
    const orderTerm = scrapeOne.match(/TERM:\s\w+/)
    const orderStatus = scrapeOne.match(/STATUS:\s\w+/)
    const orderSKU = scrapeOne.match(/SKU:\s\w+\-\w+\-\w+\-\w+\-\w+\d/)
    const orderSubTotal = scrapeOne.match(/Subtotal:\s\$\d+\.\d+/)
    const orderShippingPlusTax = scrapeOne.match(
      /Shipping \(Ships Free\):\s\$\d+\.\d+/
    )
    const orderSalesTax = scrapeOne.match(/Sales Tax 8.25%:\s\$\d+\.\d+/)
    const orderOrderTotal = scrapeOne.match(/Order Total:\s\$\d+\.\d+/)

    setScrapeValues(
      Object.assign({}, scrapeValues, {
        name: name ? name[0].replace('New order from: ', '') : '',
        phone: phone ? phone[0] : '',
        email: email ? email[0] : '',
        OrderNumber: order ? order[0].replace('Order: ', '') : '',
        OrderDate: date ? date[0].replace('Date: ', '') : '',
        ShippingAddress: shipping
          ? shipping[0]
              .replace('Shipping Address ', '')
              .replace('Billing Address', '')
          : '',
        BillingAddress: billing
          ? billing[0].replace('Billing Address ', '').replace('Shipping Method', '')
          : '',
        Order: {
          City: orderCity ? orderCity[0].replace('City: ', '') : '',
          Plan: orderPlan ? orderPlan[0].replace('Plan: ', '') : '',
          Term: orderTerm ? orderTerm[0].replace('Term: ', '') : '',
          Status: orderStatus ? orderStatus[0].replace('Status: ', '') : '',
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
        'sKU: ' +
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
      <h1>Email Scraper</h1>
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
      </div>
      <div className={styles.scrapeWrapper}>
        <textarea
          id={'output'}
          value={outputText}
          className={styles.scrapeOutput}
          onChange={(event) => setOutputText(event.target.value)}
        ></textarea>
      </div>
    </div>
  )
}
