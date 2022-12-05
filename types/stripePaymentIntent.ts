export type stripePaymentIntent = {
  id: string
  object: string
  amount: number
  amount_capturable: number
  amount_details: {
    tip: {
      amount: number
      currency: string
    }
  }
  amount_received: number
  application: string
  application_fee_amount: string
  automatic_payment_methods: string
  canceled_at: string
  cancellation_reason: string
  capture_method: string
  client_secret: string
  confirmation_method: string
  created: number
  currency: string
  customer: string
  description: string
  invoice: string
  last_payment_error: string
  latest_charge: string
  livemode: boolean
  metadata: {
    [key: string]: string
  }
  next_action: string
  on_behalf_of: string
  payment_method: string
  payment_method_options: Record<string, unknown>
  payment_method_types: string[]
  processing: string
  receipt_email: string
  review: string
  setup_future_usage: string
  shipping: string
  statement_descriptor: string
  statement_descriptor_suffix: string
  status: string
  transfer_data: string
  transfer_group: string
}
