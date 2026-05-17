import { X, User, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Users } from "@/helper/types/types";

interface UserDetailDrawerProps {
  user: Users | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailDrawer({ user, open, onClose }: UserDetailDrawerProps) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full shadow-lg overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-background">
          <h2 className="text-lg font-semibold">User Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <span className={`mt-2 rounded-md text-xs px-2 py-1 text-white ${
              user.role === "super_admin" ? "bg-green-400" :
              user.role === "admin" ? "bg-blue-400" :
              user.role === "staff" ? "bg-yellow-400" : "bg-gray-400"
            }`}>
              {user.role}
            </span>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Activity
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Permissions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                <p className="text-muted-foreground">{user.phoneNumber || "N/A"}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Hostel</label>
                <p className="text-muted-foreground">{user.hostel?.name || "N/A"}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Last Login</label>
                <p className="text-muted-foreground">{user.lastLoginAt || "Never"}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Created At</label>
                <p className="text-muted-foreground">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <p className="text-muted-foreground text-sm">Activity log will show here after implementing activity tracking.</p>
            </TabsContent>
            
            <TabsContent value="permissions" className="mt-4">
              <p className="text-muted-foreground text-sm">Permissions will be shown based on user's role.</p>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2 mt-6">
            <Button className="flex-1">Reset Password</Button>
            <Button variant="destructive" className="flex-1">Deactivate</Button>
          </div>
        </div>
      </div>
    </div>
  );
}