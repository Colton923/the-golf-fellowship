interface Props {
  children: React.ReactNode
}
export default async function Layout({ children }: Props) {
  return (
    <div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  )
}
