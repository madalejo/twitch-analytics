import { Card, CardBody, CardHeader } from '@nextui-org/react'

export default function StreamSummary({ stats }) {
  if (!stats) return null;
  
  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h3 className="font-bold text-large">Stream Summary</h3>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.totalStreams || 0}</p>
            <p className="text-small">Total Streams</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{Math.round(stats.totalStreamTime || 0)}</p>
            <p className="text-small">Stream Hours</p>
          </Card>
        </div>
        
        <Card className="p-4">
          <p className="mb-2 text-center">Recent Streams</p>
          {stats.streams && stats.streams.length > 0 ? (
            <ul className="text-left list-disc pl-5">
              {stats.streams.slice(0, 5).map(stream => (
                <li key={stream.id}>
                  {new Date(stream.start_time).toLocaleDateString()} 
                  ({stream.viewer_count || 'N/A'} viewers)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No recent streams</p>
          )}
        </Card>
      </CardBody>
    </Card>
  )
}