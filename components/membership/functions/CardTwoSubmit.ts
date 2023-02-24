import { CardTwoSubmitProps } from '../../../types/props/CardTwoSubmitProps'
import { getDocs } from 'firebase/firestore'

const CardTwoSubmit = (props: CardTwoSubmitProps) => {
  const {
    setCheckoutData,
    setShowCardTwo,
    setShowCardOne,
    setShowCheckout,
    setIntervalPurchase,
    setTotalPrice,
    setLineItemPrice,
    setStage,
    selectedTerm,
    membershipRef,
    data,
    status,
  } = { ...props }

  const Submit = async () => {
    setCheckoutData(data)
    setShowCardTwo(false)
    setShowCardOne(false)
    setShowCheckout(true)
    setIntervalPurchase('')

    const getMembershipPrice = async (season: boolean) => {
      const membershipDoc = await getDocs(membershipRef)
      const onlyDoc = membershipDoc.docs[0]

      if (season) {
        //@ts-ignore
        const seasonal = data.subTerm.toString().toLowerCase()
        return onlyDoc.data().plans[data.plan][data.term][seasonal]
      } else {
        return onlyDoc.data().plans[data.plan][data.term]
      }
    }

    let tempPrice = 0
    if (data.status === 'new') {
      tempPrice += status.new.price
    }
    if (data.term.toLowerCase() === 'seasonal') {
      const price = await getMembershipPrice(true)

      tempPrice += price[1]
      setLineItemPrice(price[1])
    } else {
      const price = await getMembershipPrice(false)
      tempPrice += price[1]
      setLineItemPrice(price[1])
    }

    setTotalPrice((tempPrice * data.quantity) / 100)

    if (selectedTerm.toLowerCase() === 'annual') {
      setIntervalPurchase('year')
    } else {
      setIntervalPurchase('month')
    }
    setStage(1)
  }
  Submit()
  return
}

export default CardTwoSubmit
