interface Props {
  children: React.ReactNode
}
export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <head />
      <body>
        <div>
          <div>
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
