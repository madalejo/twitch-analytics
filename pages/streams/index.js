import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Card, Table, Text, Loading } from '@nextui-org/react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function Streams({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [streams, setStreams] = useState([])

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    async function loadStreams() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('streams')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
        
        if (error) throw error
        
        setStreams(data || [])
      } catch (error) {
        console.error('Error loading streams:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStreams()
  }, [user, router])

  if (loading) {
    return (
      <Container css={{ textAlign: 'center', mt: '100px' }}>
        <Loading size="xl" />
      </Container>
    )
  }

  return (
    <Container>
      <Text h1>Streams</Text>
      
      <Card>
        <Table
          aria-label="Streams table"
          css={{ height: 'auto', minWidth: '100%' }}
          selectionMode="none"
        >
          <Table.Header>
            <Table.Column>DATE</Table.Column>
            <Table.Column>DURATION</Table.Column>
            <Table.Column>VIEWERS</Table.Column>
            <Table.Column>ACTIONS</Table.Column>
          </Table.Header>
          <Table.Body>
            {streams.length === 0 ? (
              <Table.Row>
                <Table.Cell css={{ textAlign: 'center' }} colSpan={4}>
                  No streams found
                </Table.Cell>
              </Table.Row>
            ) : (
              streams.map((stream) => {
                const startDate = new Date(stream.start_time)
                const endDate = stream.end_time ? new Date(stream.end_time) : null
                const duration = endDate 
                  ? Math.round((endDate - startDate) / (1000 * 60 * 60)) 
                  : 'Live'
                
                return (
                  <Table.Row key={stream.id}>
                    <Table.Cell>{startDate.toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{typeof duration === 'number' ? `${duration} hours` : duration}</Table.Cell>
                    <Table.Cell>{stream.viewer_count || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      <Link href={`/streams/${stream.id}`}>
                        <a>View Details</a>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )}
          </Table.Body>
        </Table>
      </Card>
    </Container>
  )
}