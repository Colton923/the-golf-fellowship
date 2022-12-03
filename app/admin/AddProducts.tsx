'use client'

import { db } from '../../firebase/firebaseClient'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/Admin.module.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import initializeStripe from '../../stripe/initializeStripe'

export const StripeProducts = () => {
  const [user] = useAuthState(auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const stripe = initializeStripe()

  const createStripeProduct = async () => {
    // const product = await stripe.products.create({
    //   name: 'Gold Special',
    // });
    return <></>
  }
}
