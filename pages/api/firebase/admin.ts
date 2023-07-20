export default async function admin(req: any, res: any) {
  const uid = req.body.uid
  if (
    uid === process.env.NEXT_PUBLIC_ADMIN_COLTON_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_KERRY_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_PAUL_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_JOURDAN_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_RAIMOND_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_JAMES_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_AARON_SECRET_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_OMAR_UID ||
    uid === process.env.NEXT_PUBLIC_ADMIN_ALEX_UID
  ) {
    res.status(200).json({ admin: true })
  } else {
    res.status(200).json({ admin: false })
  }
}
