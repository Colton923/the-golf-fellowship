export type stripeProduct = {
  id?: string
  object?: string // 'product'
  active?: boolean
  created?: number
  default_price?: string
  description?: string
  images?: string[]
  livemode?: boolean
  metadata?: {
    [key: string]: string
  }
  name: string
  package_dimensions?: null
  shippable?: boolean
  statement_descriptor?: string
  tax_code?: string
  unit_label?: string
  updated?: number
  url?: string
}
