import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Grid, Card, Text, Loading, Table } from '@nextui-org/react'
import { supabase } from '../../lib/supabase'

export default function StreamDetails({ user }) {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [stream, setStream] = useState(null)
  const [viewers, setViewers] = useState([])

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    // Only fetch if id is available
    if (!id) return

    async function loadStreamData() {
      try {
        setLoading(true)
        
        // Get stream details
        const { data: streamData, error: streamError } = await supabase
          .from('streams')
          .select('*')
          .eq('id', id)
          .single()
        
        if (streamError) throw streamError
        
        // Get stream viewers
        const { data: viewerData, error: viewerError } = await supabase
          .from('stream_viewers')
          .select('*')
          .eq('stream_id', id)
        
        if (viewerError) throw viewerError
        
        setStream(streamData)
        setViewers(viewerData || [])
      } catch (error) {
        console.error('Error loading stream data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStreamData()
  }, [user, router, id])

  if (loading || !stream) {
    return (
      <Container css={{ textAlign: 'center', mt: '100px' }}>
        <Loading size="xl" />
      </Container>
    )
  }

  return (
    <Container>
      <Text h1>Stream Details</Text>
      
      <Card css={{ p: '20px', mb: '20px' }}>
        <Card.Header>
          <Text h3>Overview</Text>
        </Card.Header>
        <Card.Body>
          <Text><b>Date:</b> {new Date(stream.start_time).toLocaleDateString()}</Text>
          <Text><b>Start Time:</b> {new Date(stream.start_time).toLocaleTimeString()}</Text>
          {stream.end_time && (
            <>
              <Text><b>End Time:</b> {new Date(stream.end_time).toLocaleTimeString()}</Text>
              <Text><b>Duration:</b> {Math.round((new Date(stream.end_time) - new Date(stream.start_time)) / (1000 * 60 * 60))} hours</Text>
            </>
          )}
          <Text><b>Viewers:</b> {stream.viewer_count || 'N/A'}</Text>
        </Card.Body>
      </Card>
      
      <Grid.Container gap={2}>
        <Grid xs={12}>
          <Card css={{ p: '20px' }}>
            <Card.Header>
              <Text h3>Viewers ({viewers.length})</Text>
            </Card.Header>
            <Card.Body>
              {viewers.length === 0 ? (
                <Text>No viewer data available</Text>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>USERNAME</Table.Column>
                    <Table.Column>TYPE</Table.Column>
                    <Table.Column>WATCH TIME</Table.Column>
                    <Table.Column>CHAT MESSAGES</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {viewers.map(viewer => (
                      <Table.Row key={viewer.id}>
                        <Table.Cell>{viewer.username}</Table.Cell>
                        <Table.Cell>{viewer.viewer_type}</Table.Cell>
                        <Table.Cell>{Math.round(viewer.minutes_watched)} minutes</Table.Cell>
                        <Table.Cell>{viewer.chat_messages}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Container>
  )
}