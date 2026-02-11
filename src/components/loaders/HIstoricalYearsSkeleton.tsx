import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { History } from 'lucide-react'

  // Historical Years Skeleton
  const HistoricalYearsSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Historical Calendar Years
        </CardTitle>
        <CardDescription>Previous calendar years and their financial summaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="w-full">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  export default HistoricalYearsSkeleton