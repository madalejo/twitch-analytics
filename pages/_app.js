import { useState, useEffect } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active user session
    const session = supabase.auth.session()
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
      authListener?.unsubscribe()
    }
  }, [])

  return (
    <NextUIProvider>
      <Layout user={user} loading={loading}>
        <Component {...pageProps} user={user} loading={loading} />
      </Layout>
    </NextUIProvider>
  )
}

export default MyApp