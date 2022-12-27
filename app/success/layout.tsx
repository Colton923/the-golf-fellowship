import Navbar from '../../components/navbar/Navbar'

export default function SuccessLayout({ children }: any) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
