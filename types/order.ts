export type Order = {
  billingAddress: string
  city: string
  club: string
  date: string
  email: string
  name: string
  orderNumber: string
  orderTotal: string
  phone: string
  plan: string
  salesTax: string
  shippingAddress: string
  sku: string
  status: string
  subTotal: string
  term: string
  metaData?: {
    link?: string
    productName?: string
    selects?: {
      [key: string]: string
    }
    qs?: {
      [key: string]: string
    }
    coupon?: string
  }
}
