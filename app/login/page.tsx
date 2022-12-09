'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseClient'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { collection, doc, setDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import styles from '../../styles/Login.module.css'
import img1 from '../../public/static/images/tgf_default_pic_1.jpg'
import img2 from '../../public/static/images/tgf_default_pic_2.jpg'
import img3 from '../../public/static/images/tgf_default_pic_3.jpg'
import img4 from '../../public/static/images/tgf_default_pic_4.jpg'
import img5 from '../../public/static/images/tgf_default_pic_5.jpg'
import img6 from '../../public/static/images/tgf_default_pic_6.jpg'
import img7 from '../../public/static/images/tgf_default_pic_7.jpg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import googleLogo from '../../public/static/images/googleLogo.png'

type FormData = {
  firstName: string
  lastName: string
  email: string
}

const validName = RegExp(/^[A-Za-z]+$/i)

const validEmail = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

export default function Page() {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [loggedIn, setLoggedIn] = useState(false)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const db = getFirestore()

  useEffect(() => {
    if (auth.currentUser) {
      setLoggedIn(true)
      router.push('/dashboard')
    } else {
      setLoggedIn(false)
    }
  }, [])

  const signInWithGoogle = async (data: FormData) => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userRef = collection(db, 'users')
      const docRef = doc(userRef, result.user.uid)
      await setDoc(docRef, {
        userTypedFirstName: data.firstName,
        userTypedLastName: data.lastName,
        userTypedEmail: data.email,
        uid: result.user.uid,
        googleAccountFirstName: result.user.displayName
          ? result.user.displayName?.split(' ')[0]
          : data.firstName,
        googleAccountLastName: result.user.displayName
          ? result.user.displayName?.split(' ')[1]
          : data.lastName,
        email: result.user.email,
        photoUrl: result.user.photoURL,
      })
      router.push('/dashboard')
    } catch (error) {
      console.log(error)
      alert('Error signing in with Google')
    }
    setValue('lastName', '')
    setValue('firstName', '')
    setValue('email', '')
  }

  // Create a background image that changes every 10 seconds
  const images = [img1, img2, img3, img4, img5, img6, img7]
  const [image, setImage] = useState(images[0])
  const [index, setIndex] = useState(2)

  useEffect(() => {
    const interval = setInterval(() => {
      if (index === images.length - 1) {
        setIndex(0)
      } else {
        setIndex(index + 1)
      }
      setImage(images[index])
    }, 16000)
    return () => clearInterval(interval)
  }, [index])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error...</div>

  if (loggedIn) return <div>Redirecting...</div>

  return (
    <>
      <div className={styles.main}>
        <div className={styles.backgroundimage}>
          <Image src={image} alt="TGF" fill />
        </div>
        <div>
          <form onSubmit={handleSubmit(signInWithGoogle)} className={styles.userform}>
            <div className={styles.userformcontent}>
              <h1 className={styles.userformheader}>Sign in with Google</h1>
              <h3 className={styles.userformsubheader}></h3>
              <div className={styles.userformheader}>
                <label className={styles.userformlabel}>FIRST NAME</label>
                <input
                  className={styles.userforminput}
                  type="text"
                  {...register('firstName', {
                    maxLength: 20,
                    required: true,
                    validate: (value) =>
                      validName.test(value) || 'First name must contain only letters',
                  })}
                />
              </div>
              <div className={styles.userformheader}>
                <label className={styles.userformlabel}>LAST NAME</label>
                <input
                  className={styles.userforminput}
                  type="text"
                  {...register('lastName', {
                    maxLength: 20,
                    required: true,
                    validate: (value) =>
                      validName.test(value) || 'Last name must contain only letters',
                  })}
                />
              </div>
              <div className={styles.userformheader}>
                <label className={styles.userformlabel}>EMAIL</label>
                <input
                  className={styles.userforminput}
                  type="text"
                  {...register('email', {
                    required: true,
                    validate: (value) => validEmail.test(value) || 'E-mail must be valid',
                  })}
                />

                <button type="submit" value="Sign In" className={styles.userformbutton}>
                  <Image src={googleLogo} alt="Google Logo" height={25} width={30} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
