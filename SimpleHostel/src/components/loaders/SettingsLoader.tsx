import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SettingsSkeleton = () => {
  return (
    <div className="container max-w-5xl px-4 py-10 mx-auto">
      {/* Title */}
      <Skeleton className="w-64 mb-6 h-9" />

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
              <Skeleton className="w-24 h-24 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-8" />
              </div>
            </div>

            {/* Hostel name */}
            <div className="grid w-full grid-cols-1 gap-6">
              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="w-64 h-3" />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Skeleton className="w-16 h-4" />
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            {/* Google Maps link */}
            <Skeleton className="w-48 h-4" />
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How can residents reach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Skeleton className="w-12 h-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Skeleton className="w-12 h-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-full h-10" />
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
              <Skeleton className="w-24 h-4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Skeleton className="w-full h-32 rounded-lg" />
                <Skeleton className="w-full h-32 rounded-lg" />
                <Skeleton className="w-full h-32 rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Skeleton className="w-32 h-11" />
        </div>
      </div>
    </div>
  )
}

export default SettingsSkeleton
