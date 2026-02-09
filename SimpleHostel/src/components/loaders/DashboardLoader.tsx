import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Loading skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-36 mb-3" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for bar charts
 */
export function BarChartSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col justify-between">
          <div className="flex-1 flex items-end gap-4 pb-8 pt-6 px-4">
            {/* Simulated bars with different heights */}
            <Skeleton className="w-1/3 h-[40%] rounded-t-md" />
            <Skeleton className="w-1/3 h-[80%] rounded-t-md" />
            <Skeleton className="w-1/3 h-[20%] rounded-t-md" />
          </div>
          <Skeleton className="h-4 w-full" /> {/* X-axis */}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for pie charts
 */
export function PieChartSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="relative">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
            {/* Simulate pie segments with absolute positioning */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div 
                className="absolute bg-red-100" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' 
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-10 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-10 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for the table card
 */
export function TableCardSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 h-8">
            <Skeleton className="h-full w-1/3" />
            <Skeleton className="h-full w-1/3" />
            <Skeleton className="h-full w-1/3" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 h-12">
              <Skeleton className="h-full w-1/3" />
              <Skeleton className="h-full w-1/3" />
              <Skeleton className="h-full w-1/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard loading state component
 */
export function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <BarChartSkeleton />
        </div>
        <div className="lg:col-span-3">
          <PieChartSkeleton />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <PieChartSkeleton />
        <TableCardSkeleton />
      </div>
      
      <TableCardSkeleton />
    </div>
  )
}
