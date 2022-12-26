import AdminNavbar from '../../components/AdminNavbar'

export default function Layout({ children }: any) {
  return (
    <>
      <AdminNavbar />
      <div>{children}</div>
    </>
  )
}
