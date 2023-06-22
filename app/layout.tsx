import Providers from '@components/context/Providers'

import '@styles/global.css'

interface Props {
  children: React.ReactNode
}
export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="The Golf Fellowship" />
      </head>
      <body style={{ margin: 0 }}>
        <div>
          <div>
            <main>
              <Providers>{children}</Providers>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
