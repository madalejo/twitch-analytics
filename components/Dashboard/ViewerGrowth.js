import { Card, Text } from '@nextui-org/react'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'

export default function ViewerGrowth({ stats }) {
  if (!stats) return null
  
  // Group viewers by first seen date
  const viewersByDate = stats.viewers.reduce((acc, viewer) => {
    const date = format(new Date(viewer.first_seen), 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = 0
    acc[date]++
    return acc
  }, {})
  
  // Convert to chart data
  const dates = Object.keys(viewersByDate).sort()
  const cumulativeViewers = dates.reduce((acc, date, index) => {
    const count = viewersByDate[date]
    const prevTotal = index > 0 ? acc[index - 1] : 0
    acc.push(prevTotal + count)
    return acc
  }, [])
  
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Viewers',
        data: cumulativeViewers,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  }
  
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Viewers'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex
            const newViewers = index === 0 
              ? cumulativeViewers[0] 
              : cumulativeViewers[index] - cumulativeViewers[index - 1]
              
            return [
              `Total: ${context.raw} viewers`,
              `New: ${newViewers} viewers`
            ]
          }
        }
      }
    }
  }
  
  return (
    <Card css={{ p: '20px', h: '100%' }}>
      <Card.Header>
        <Text h3>Viewer Growth Over Time</Text>
      </Card.Header>
      <Card.Body>
        <Line data={chartData} options={options} />
      </Card.Body>
    </Card>
  )
}