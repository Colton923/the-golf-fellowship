import PaymentStatus from "../../components/PaymentStatus"


export default function SuccessLayout({ children }: any){

  console.log(PaymentStatus)
  return (
    <div>
      <div>{children}</div>
    </div>
  )
}
