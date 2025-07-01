import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import { Container, Grid, Card, Text, Spacer, Progress, Badge, Table } from '@nextui-org/react'
import { Bar, Line } from 'react-chartjs-2'
import { format } from 'date-fns'

export default function ViewerDetail({ user }) {
  const router = useRouter()
  const { username } = router.query
  const [loading, setLoading] = useState(true)
  const [viewerData, setViewerData] = useState(null)
  const [streamHistory, setStreamHistory] = useState([])
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    // Only fetch if username is available
    if (!username) return

    async function loadViewerData() {
      try {
        setLoading(true)
        
        // Get viewer profile
        const { data: profile, error: profileError } = await supabase
          .from('viewer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .eq('username', username)
          .single()
        
        if (profileError) throw profileError
        
        // Get stream history for this viewer
        const { data: streamData, error: streamError } = await supabase
          .from('stream_viewers')
          .select('*, streams(id, start_time, title)')
          .eq('username', username)
          .order('first_seen', { ascending: false })
        
        if (streamError) throw streamError
        
        // Get chat messages
        const { data: chatData, error: chatError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('username', username)
          .order('timestamp', { ascending: false })
          .limit(100)
        
        if (chatError) throw chatError
        
        setViewerData(profile)
        setStreamHistory(streamData)
        setChatHistory(chatData)
      } catch (error) {
        console.error('Error loading viewer data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadViewerData()
  }, [user, router, username])

  if (loading || !viewerData) {
    return (
      <Container>
        <Text h2>Loading viewer data...</Text>
      </Container>
    )
  }

  // Calculate engagement metrics
  const engagementScore = Math.min(
    100, 
    (viewerData.total_chat_messages / (viewerData.total_minutes_watched / 10)) * 100
  )
  
  const loyaltyScore = Math.min(
    100,
    (viewerData.streams_watched * viewerData.total_minutes_watched) / 1000
  )
  
  // Prepare chart data for watch time
  const watchTimeByStream = streamHistory.map(record => ({
    date: new Date(record.streams.start_time),
    minutes: record.minutes_watched
  })).sort((a, b) => a.date - b.date)
  
  const watchTimeChartData = {
    labels: watchTimeByStream.map(item => format(item.date, 'MMM d')),
    datasets: [
      {
        label: 'Watch Time (minutes)',
        data: watchTimeByStream.map(item => item.minutes),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <Container>
      <Text h1>{username}</Text>
      <Badge color={
        viewerData.viewer_type === 'subscriber' ? 'success' :
        viewerData.viewer_type === 'moderator' ? 'warning' : 'primary'
      } size="lg">
        {viewerData.viewer_type}
      </Badge>
      
      <Spacer y={1} />
      
      <Grid.Container gap={2}>
        <Grid xs={12} md={6}>
          <Card css={{ p: '20px', h: '100%' }}>
            <Card.Header>
              <Text h3>Viewer Profile</Text>
            </Card.Header>
            <Card.Body>
              <Text><b>First Seen:</b> {new Date(viewerData.first_seen).toLocaleDateString()}</Text>
              <Text><b>Last Seen:</b> {new Date(viewerData.last_seen).toLocaleDateString()}</Text>
              <Text><b>Streams Watched:</b> {viewerData.streams_watched}</Text>
              <Text><b>Total Watch Time:</b> {Math.round(viewerData.total_minutes_watched / 60)} hours</Text>
              <Text><b>Chat Messages:</b> {viewerData.total_chat_messages}</Text>
              
              <Spacer y={1} />
              
              <Text><b>Engagement Score:</b></Text>
              <Progress 
                value={engagementScore} 
                color="primary" 
                status={engagementScore > 70 ? "success" : engagementScore > 30 ? "warning" : "error"}
              />
              
              <Spacer y={1} />
              
              <Text><b>Loyalty Score:</b></Text>
              <Progress 
                value={loyaltyScore} 
                color="secondary" 
                status={loyaltyScore > 70 ? "success" : loyaltyScore > 30 ? "warning" : "error"}
              />
              
              {viewerData.is_new_viewer && (
                <>
                  <Spacer y={1} />
                  <Badge color="primary">New Viewer</Badge>
                </>
              )}
              
              {viewerData.streams_since_last_visit > 5 && (
                <>
                  <Spacer y={1} />
                  <Badge color="warning">Returned after {viewerData.streams_since_last_visit} streams</Badge>
                </>
              )}
            </Card.Body>
          </Card>
        </Grid>
        
        <Grid xs={12} md={6}>
          <Card css={{ p: '20px', h: '100%' }}>
            <Card.Header>
              <Text h3>Watch Time History</Text>
            </Card.Header>
            <Card.Body>
              <Bar data={watchTimeChartData} />
            </Card.Body>
          </Card>
        </Grid>
        
        <Grid xs={12}>
          <Card css={{ p: '20px' }}>
            <Card.Header>
              <Text h3>Recent Chat Messages</Text>
            </Card.Header>
            <Card.Body>
              {chatHistory.length === 0 ? (
                <Text>No chat messages found.</Text>
              ) : (
                <Table>
                  <Table.Header>
                    <Table.Column>DATE</Table.Column>
                    <Table.Column>MESSAGE</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {chatHistory.map(msg => (
                      <Table.Row key={msg.id}>
                        <Table.Cell>{new Date(msg.timestamp).toLocaleString()}</Table.Cell>
                        <Table.Cell>{msg.message}</Table.Cell>
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