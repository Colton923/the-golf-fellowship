import Navbar from '@components/navbar/Navbar'
import styles from '@styles/App.module.css'
import Login from '@components/login/Login'
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
              <div className={styles.main}>
                <Navbar />
                <Login />
              </div>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
