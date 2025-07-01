import { Card, Text, Grid, Progress } from '@nextui-org/react'

export default function ViewerStats({ stats }) {
  if (!stats) return null;

  // Calculate engagement rate
  const engagementRate = stats.totalViewers ? 
    (stats.totalChatMessages / stats.totalViewers).toFixed(1) : 0;
  
  // Calculate engagement percentage
  const engagementPercentage = stats.totalViewers ?
    Math.min(100, (stats.totalChatMessages / stats.totalViewers) * 10) : 0;
  
  return (
    <Card css={{ p: '20px', h: '100%', w: '100%' }}>
      <Card.Header>
        <Text h3>Viewer Stats</Text>
      </Card.Header>
      <Card.Body>
        <Grid.Container gap={2}>
          <Grid xs={6}>
            <Card variant="flat">
              <Card.Body css={{ textAlign: 'center', py: '10px' }}>
                <Text h2 css={{ m: 0 }}>{stats.totalViewers || 0}</Text>
                <Text>Total Viewers</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card variant="flat">
              <Card.Body css={{ textAlign: 'center', py: '10px' }}>
                <Text h2 css={{ m: 0 }}>{stats.totalChatMessages || 0}</Text>
                <Text>Chat Messages</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card variant="flat">
              <Card.Body css={{ p: '10px' }}>
                <Text css={{ mb: '5px' }}>Viewer Engagement</Text>
                <Progress 
                  value={engagementPercentage} 
                  color="primary" 
                  status={engagementPercentage > 70 ? "success" : 
                          engagementPercentage > 30 ? "warning" : "error"}
                />
                <Text css={{ mt: '5px', textAlign: 'center' }}>
                  {engagementRate} messages per viewer
                </Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card variant="flat">
              <Card.Body css={{ p: '10px' }}>
                <Text css={{ mb: '5px' }}>Returning Viewers</Text>
                <Progress 
                  value={stats.returningViewerPercentage || 0} 
                  color="secondary"
                />
                <Text css={{ mt: '5px', textAlign: 'center' }}>
                  {Math.round(stats.returningViewerPercentage || 0)}% return rate
                </Text>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Card.Body>
    </Card>
  )
}