export type stripeCustomer = {
  id: string
  object: string
  address?: {
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    state: string
  }
  balance?: number
  created?: number
  currency?: string
  default_source?: string
  delinquent?: boolean
  description?: string
  discount?: string
  email?: string
  invoice_prefix?: string
  invoice_settings?: {
    custom_fields: string
    default_payment_method: string
    footer: string
    rendering_options: string
  }
  livemode?: boolean
  metadata?: {
    [key: string]: string
  }
  name?: string
  next_invoice_sequence?: number
  phone?: string
  preferred_locales?: string[]
  shipping?: {
    name: string
    phone: string
    address: {
      city: string
      country: string
      line1: string
      line2: string
      postal_code: string
      state: string
    }
  }
  tax_exempt?: string
  test_clock?: string
}
