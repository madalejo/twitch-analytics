import { useState, useEffect } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active user session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
          setLoading(false)
        }
      )

      return () => {
        authListener?.subscription.unsubscribe()
      }
    }

    getSession()
  }, [])

  return (
    <NextThemesProvider defaultTheme="dark" attribute="class">
      <NextUIProvider>
        <Layout user={user} loading={loading}>
          <Component {...pageProps} user={user} loading={loading} />
        </Layout>
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp