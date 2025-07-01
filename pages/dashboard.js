import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { Container, Grid, Loading, Text } from '@nextui-org/react'
import StreamSummary from '../components/Dashboard/StreamSummary'
import ViewerStats from '../components/Dashboard/ViewerStats'
import ChatActivity from '../components/Dashboard/ChatActivity'
import ViewerGrowth from '../components/Dashboard/ViewerGrowth'

export default function Dashboard({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    async function loadDashboardData() {
      try {
        setLoading(true)
        
        // Get stream summary stats
        const { data: streamData, error: streamError } = await supabase
          .from('streams')
          .select('id, start_time, end_time, viewer_count')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(10)
        
        if (streamError) throw streamError
        
        // Get overall viewer stats
        const { data: viewerData, error: viewerError } = await supabase
          .from('viewer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('total_minutes_watched', { ascending: false })
          .limit(100)
        
        if (viewerError) throw viewerError
        
        // Calculate statistics
        const totalViewers = viewerData.length
        const totalStreamTime = streamData.reduce((acc, stream) => {
          if (stream.end_time) {
            const duration = new Date(stream.end_time) - new Date(stream.start_time)
            return acc + duration
          }
          return acc
        }, 0) / (1000 * 60 * 60) // Convert to hours
        
        const totalChatMessages = viewerData.reduce((acc, viewer) => 
          acc + viewer.total_chat_messages, 0)
        
        const returningViewerPercentage = viewerData.filter(v => 
          v.streams_watched > 1).length / totalViewers * 100
        
        setStats({
          totalStreams: streamData.length,
          totalStreamTime,
          totalViewers,
          totalChatMessages,
          returningViewerPercentage,
          streams: streamData,
          viewers: viewerData
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [user, router])

  if (loading) {
    return (
      <Container css={{ textAlign: 'center', mt: '100px' }}>
        <Loading size="xl" />
        <Text css={{ mt: '20px' }}>Loading your dashboard...</Text>
      </Container>
    )
  }

  return (
    <Container>
      <Text h1>Dashboard</Text>
      <Grid.Container gap={2}>
        <Grid xs={12} md={6}>
          <StreamSummary stats={stats} />
        </Grid>
        <Grid xs={12} md={6}>
          <ViewerStats stats={stats} />
        </Grid>
        <Grid xs={12} md={6}>
          <ChatActivity stats={stats} />
        </Grid>
        <Grid xs={12} md={6}>
          <ViewerGrowth stats={stats} />
        </Grid>
      </Grid.Container>
    </Container>
  )
}