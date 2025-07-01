import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { Button, Container, Card, Text, Spacer } from '@nextui-org/react'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleTwitchLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn(
        { provider: 'twitch' },
        { redirectTo: `${window.location.origin}/dashboard` }
      )
      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container xs css={{ mt: '100px', textAlign: 'center' }}>
      <Card css={{ p: '40px' }}>
        <Card.Header>
          <Text h2>Twitch Viewer Analytics</Text>
        </Card.Header>
        <Card.Body>
          <Text>Track your viewer engagement and growth over time</Text>
          <Spacer y={2} />
          <Button
            color="secondary"
            size="lg"
            onClick={handleTwitchLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login with Twitch'}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  )
}