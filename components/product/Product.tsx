// import type { stripeProduct } from 'types/stripe/stripeProduct'
// import type { stripePrice } from 'types/stripe/stripePrice'
import { Button } from '@mantine/core'
// import client from 'lib/sanity/client'
// import queries from 'lib/sanity/queries'

interface ProductProps {
  inter: string
}

const Product = () => {
  const handleClick = async () => {
    await fetch('/api/sanity/createProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        res.json().then((data) => {
          console.log(data)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return <Button onClick={handleClick}></Button>
}

export default Product
