export type stripePrice = {
  id?: string
  object?: string // 'price'
  product: string
  type?: string
  currency: string
  recurring?: {
    aggregate_usage?: null
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count?: number
    trial_period_days?: null
    usage_type?: string
  }
  active?: boolean
  billing_scheme?: string
  created?: number
  livemode?: boolean
  lookup_key?: null
  metadata?: {
    [key: string]: string
  }
  nickname?: null
  unit_amount: number
  unit_amount_decimal?: string
  tiers?: null
  tiers_mode?: null
  transform_quantity?: null
}
