import { auth } from '../firebase/firebaseClient'
export default async function isUserPremium(): Promise<boolean> {
  const user = auth.currentUser
  if (!user?.displayName) return false
  const token = await user.getIdTokenResult()
  console.log('token: ', !!token.claims.stripeRole)
  return !!token.claims.stripeRole
}
