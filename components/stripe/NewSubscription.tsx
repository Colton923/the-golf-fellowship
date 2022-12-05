interface CreateNewSubscriptionProps {
  requestData: body
}

export type body = {
  sub: {
    name: string
    description: string
    unit_amount: number
    currency: string
    recurring: {
      aggregate_usage?: string
      interval: 'day' | 'week' | 'month' | 'year'
      interval_count?: number
      trial_period_days?: string
      usage_type?: string
    }
  }
  uid: string
}

export default function NewSubscription(props: CreateNewSubscriptionProps) {
  fetch('api/stripe_subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(props.requestData),
  })
    .then((res) => res.json())
    .then((data) => {
      return data.message
    })
}
