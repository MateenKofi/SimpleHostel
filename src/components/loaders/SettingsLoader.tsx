import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SettingsSkeleton = () => {
  return (
    <div className="container max-w-5xl px-4 py-10 mx-auto">
      {/* Title */}
      <Skeleton className="h-9 w-64 mb-6" />

      <div className="space-y-8">
        {/* General Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Manage your hostel's basic details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo upload area */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* Hostel name */}
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-3 w-64" />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Google Maps link */}
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How can folks reach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hostel Images Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hostel Images</CardTitle>
            <CardDescription>Max 3 pictures to paint your story.</CardDescription>
          </CardHeader>
          <CardContent className="mx-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  )
}

export default SettingsSkeleton
