"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

const ProfileForm =() => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
      <h1 className='text-3xl font-bold'>Account Settings</h1>
      <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Your Photo</h2>
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-26%20164001-MneF5yT9wiQbKGuL2cJou20f7j7FhN.png"
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="mt-2 flex gap-2 text-sm text-blue-600">
                <button className="hover:underline">Delete</button>
                <span>·</span>
                <button className="hover:underline">Update</button>
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                  <div className="text-xs text-gray-500">SVG, PNG, JPG or GIF</div>
                  <div className="text-xs text-gray-400">(max. 800 x 800px)</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="David Jhon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+990 3543 7865" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="davidjohn45@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="davidjhon24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Description</Label>
              <Textarea
                id="bio"
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </Card>
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
    </div>
  )
}
export default ProfileForm

