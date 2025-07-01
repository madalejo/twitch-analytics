import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { Button, Card, CardBody, CardHeader, Spacer } from '@nextui-org/react'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleTwitchLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl font-bold">Twitch Viewer Analytics</h2>
        </CardHeader>
        <CardBody>
          <p className="text-center">Track your viewer engagement and growth over time</p>
          <Spacer y={8} />
          <Button
            color="secondary"
            size="lg"
            className="w-full"
            onClick={handleTwitchLogin}
            isLoading={loading}
          >
            {loading ? 'Loading...' : 'Login with Twitch'}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}