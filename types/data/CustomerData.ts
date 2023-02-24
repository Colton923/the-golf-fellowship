export type CustomerData = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: {
    country: string
    street: string
    opt?: string
    postalCode: string
    city: string
    state: string
    special?: string
  }
  amount: number
}
