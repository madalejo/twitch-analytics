import { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar, Button, Text, Link, Container } from '@nextui-org/react'
import NextLink from 'next/link'
import { supabase } from '../lib/supabase'

export default function Layout({ children, user, loading }) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Don't show navbar on login page
  if (router.pathname === '/login') {
    return <>{children}</>
  }

  return (
    <>
      <Navbar isCompact isBordered variant="sticky" maxWidth="fluid">
        <Navbar.Brand>
          <Text b color="inherit">
            Twitch Viewer Analytics
          </Text>
        </Navbar.Brand>

        <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
          <Navbar.Link 
            as={NextLink} 
            href="/dashboard"
            isActive={router.pathname === '/dashboard'}
          >
            Dashboard
          </Navbar.Link>
          <Navbar.Link 
            as={NextLink} 
            href="/streams"
            isActive={router.pathname === '/streams' || router.pathname.startsWith('/streams/')}
          >
            Streams
          </Navbar.Link>
          <Navbar.Link 
            as={NextLink} 
            href="/viewers"
            isActive={router.pathname === '/viewers' || router.pathname.startsWith('/viewers/')}
          >
            Viewers
          </Navbar.Link>
        </Navbar.Content>

        <Navbar.Content>
          {user ? (
            <>
              <Navbar.Item>
                <Text>{user.email || user.user_metadata?.name || 'User'}</Text>
              </Navbar.Item>
              <Navbar.Item>
                <Button auto flat onClick={handleSignOut}>
                  Sign Out
                </Button>
              </Navbar.Item>
            </>
          ) : loading ? (
            <Navbar.Item>
              <Text>Loading...</Text>
            </Navbar.Item>
          ) : (
            <Navbar.Item>
              <Button auto flat as={NextLink} href="/login">
                Sign In
              </Button>
            </Navbar.Item>
          )}
        </Navbar.Content>
      </Navbar>

      <Container 
        lg 
        as="main" 
        css={{ 
          paddingTop: '2rem', 
          paddingBottom: '4rem',
          minHeight: 'calc(100vh - 76px)'
        }}
      >
        {children}
      </Container>

      <Container as="footer" css={{ textAlign: 'center', padding: '2rem 0' }}>
        <Text size="small" color="gray">
          © {new Date().getFullYear()} Twitch Viewer Analytics
        </Text>
      </Container>
    </>
  )
}