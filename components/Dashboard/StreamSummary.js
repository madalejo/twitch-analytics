import { Card, Text, Grid, Col } from '@nextui-org/react'

export default function StreamSummary({ stats }) {
  if (!stats) return null;
  
  return (
    <Card css={{ p: '20px', h: '100%', w: '100%' }}>
      <Card.Header>
        <Text h3>Stream Summary</Text>
      </Card.Header>
      <Card.Body>
        <Grid.Container gap={2}>
          <Grid xs={6}>
            <Card variant="flat">
              <Card.Body css={{ textAlign: 'center', py: '10px' }}>
                <Text h2 css={{ m: 0 }}>{stats.totalStreams || 0}</Text>
                <Text>Total Streams</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={6}>
            <Card variant="flat">
              <Card.Body css={{ textAlign: 'center', py: '10px' }}>
                <Text h2 css={{ m: 0 }}>{Math.round(stats.totalStreamTime || 0)}</Text>
                <Text>Stream Hours</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card variant="flat">
              <Card.Body css={{ textAlign: 'center', py: '10px' }}>
                <Text css={{ mb: '5px' }}>Recent Streams</Text>
                {stats.streams && stats.streams.length > 0 ? (
                  <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    {stats.streams.slice(0, 5).map(stream => (
                      <li key={stream.id}>
                        {new Date(stream.start_time).toLocaleDateString()} 
                        ({stream.viewer_count || 'N/A'} viewers)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text css={{ color: 'gray' }}>No recent streams</Text>
                )}
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Card.Body>
    </Card>
  )
}