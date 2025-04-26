"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from 'lucide-react'

const ViewRoomSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Back button */}
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        <Skeleton className="h-4 w-24" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Room images skeleton */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Main image skeleton */}
              <div className="aspect-video relative overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Thumbnails skeleton */}
              <div className="flex gap-2 p-2 overflow-x-auto">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="w-20 h-20 rounded-md" />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Room details skeleton */}
        <div className="space-y-6">
          {/* Room info card skeleton */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hall information card skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Room details tabs skeleton */}
      <div className="mt-6">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="history">Assignment History</TabsTrigger>
          </TabsList>
          <div className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
export default ViewRoomSkeleton