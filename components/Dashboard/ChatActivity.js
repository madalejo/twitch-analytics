import { Card, Text } from '@nextui-org/react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables)
}

export default function ChatActivity({ stats }) {
  if (!stats || !stats.viewers) return null;
  
  // Get top chatters
  const topChatters = [...stats.viewers]
    .sort((a, b) => b.total_chat_messages - a.total_chat_messages)
    .slice(0, 10);
  
  const chartData = {
    labels: topChatters.map(v => v.username),
    datasets: [
      {
        label: 'Chat Messages',
        data: topChatters.map(v => v.total_chat_messages),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Messages'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Viewer'
        }
      }
    }
  };
  
  return (
    <Card css={{ p: '20px', h: '100%', w: '100%' }}>
      <Card.Header>
        <Text h3>Chat Activity</Text>
      </Card.Header>
      <Card.Body css={{ height: '300px' }}>
        {topChatters.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Text css={{ textAlign: 'center', mt: '100px', color: 'gray' }}>
            No chat data available
          </Text>
        )}
      </Card.Body>
    </Card>
  )
}