import Providers from '@components/context/Providers'
import CalendarIcon from '@components/sales/calendarIcon/CalendarIcon'

import '@styles/global.css'

interface Props {
  children: React.ReactNode
  modal: React.ReactNode
}
export default async function RootLayout({ children, modal }: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="The Golf Fellowship" />
        <meta name="author" content="Colton McClintock" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="static/images/favicon.ico" />
        <title>The Golf Fellowship</title>
      </head>
      <body>
        <main>
          <Providers>
            {children}
          {modal}
          </Providers>
          <div
            id="recaptcha-container"
            style={{
              display: 'none',
            }}
          ></div>
        </main>
      </body>
    </html>
  )
}
