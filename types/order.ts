export type Order = {
  name: string
  phone: string
  email: string
  orderNumber: string
  orderDate: string
  shippingAddress: string
  billingAddress: string
  order: {
    city: string
    plan: string
    term: string
    status: string
    sku: string
    subTotal: string
    shippingPlusTax: string
    salesTax: string
    orderTotal: string
  }
}
