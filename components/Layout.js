import { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link as NextUILink } from '@nextui-org/react'
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
      <Navbar isBordered>
        <NavbarBrand>
          <p className="font-bold text-inherit">Twitch Viewer Analytics</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={router.pathname === '/dashboard'}>
            <NextLink href="/dashboard" passHref>
              Dashboard
            </NextLink>
          </NavbarItem>
          <NavbarItem isActive={router.pathname === '/streams' || router.pathname.startsWith('/streams/')}>
            <NextLink href="/streams" passHref>
              Streams
            </NextLink>
          </NavbarItem>
          <NavbarItem isActive={router.pathname === '/viewers' || router.pathname.startsWith('/viewers/')}>
            <NextLink href="/viewers" passHref>
              Viewers
            </NextLink>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          {user ? (
            <>
              <NavbarItem>
                <p className="text-sm">{user.email || user.user_metadata?.name || 'User'}</p>
              </NavbarItem>
              <NavbarItem>
                <Button color="danger" variant="flat" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </NavbarItem>
            </>
          ) : loading ? (
            <NavbarItem>
              <p>Loading...</p>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button as={NextLink} color="primary" href="/login" variant="flat">
                Sign In
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-6 py-8 min-h-screen">
        {children}
      </main>

      <footer className="text-center p-8">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Twitch Viewer Analytics
        </p>
      </footer>
    </>
  )
}