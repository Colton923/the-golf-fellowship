import type { CollectionReference, DocumentData } from 'firebase/firestore'
import type { FormData } from '../../types/data/FormData'

export interface CardTwoSubmitProps {
  setCheckoutData: (data: any) => void
  setShowCardTwo: (bool: boolean) => void
  setShowCardOne: (bool: boolean) => void
  setShowCheckout: (bool: boolean) => void
  setIntervalPurchase: (string: string) => void
  setTotalPrice: (number: number) => void
  setLineItemPrice: (number: number) => void
  setStage: (number: number) => void
  selectedTerm: string
  membershipRef: CollectionReference<DocumentData>
  data: FormData
  status: {
    returning: {
      title: string
      price: number
    }
    new: {
      title: string
      price: number
    }
  }
}
