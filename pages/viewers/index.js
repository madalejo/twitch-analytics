import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import { Container, Card, Table, Text, Input, Spacer, Badge } from '@nextui-org/react'
import Link from 'next/link'

export default function Viewers({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [viewers, setViewers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    async function loadViewers() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('viewer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('last_seen', { ascending: false })
        
        if (error) throw error
        
        setViewers(data)
      } catch (error) {
        console.error('Error loading viewers:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadViewers()
  }, [user, router])

  // Filter viewers by search
  const filteredViewers = viewers.filter(viewer => 
    viewer.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container>
      <Text h1>Viewers</Text>
      
      <Input
        placeholder="Search viewers..."
        fullWidth
        clearable
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <Spacer y={1} />
      
      <Card>
        <Table
          aria-label="Viewers table"
          css={{ height: 'auto', minWidth: '100%' }}
          selectionMode="none"
        >
          <Table.Header>
            <Table.Column>USERNAME</Table.Column>
            <Table.Column>TYPE</Table.Column>
            <Table.Column>STREAMS</Table.Column>
            <Table.Column>WATCH TIME</Table.Column>
            <Table.Column>CHAT MESSAGES</Table.Column>
            <Table.Column>LAST SEEN</Table.Column>
          </Table.Header>
          <Table.Body loadingState={loading ? "loading" : "idle"}>
            {filteredViewers.map((viewer) => (
              <Table.Row key={viewer.id}>
                <Table.Cell>
                  <Link href={`/viewers/${viewer.username}`}>
                    <a>{viewer.username}</a>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={
                    viewer.viewer_type === 'subscriber' ? 'success' :
                    viewer.viewer_type === 'moderator' ? 'warning' : 'primary'
                  }>
                    {viewer.viewer_type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{viewer.streams_watched}</Table.Cell>
                <Table.Cell>{Math.round(viewer.total_minutes_watched / 60)} hours</Table.Cell>
                <Table.Cell>{viewer.total_chat_messages}</Table.Cell>
                <Table.Cell>{new Date(viewer.last_seen).toLocaleDateString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </Container>
  )
}