"use client"

import { useState } from "react"
import { Search, User, Home, Phone, Mail, CreditCard, AlertCircle, Loader2, CheckCircle2, Key, Building2, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ResidentDto } from "@/types/dtos"
import { verifyResidentAccessCode, checkInResident } from "@/api/residents"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

const floatingCard = "bg-gradient-to-br from-card to-muted/50 rounded-2xl shadow-lg border border-border/50"
const iconContainerInfo = "p-2.5 rounded-xl bg-gradient-to-br from-forest-green-50 to-forest-green-100/50"
const iconContainerPrimary = "p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50"

const ResidentLookup = () => {
  const navigate = useNavigate()
  const [secretCode, setSecretCode] = useState("")
  const [foundResident, setFoundResident] = useState<ResidentDto | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [error, setError] = useState<string>("")
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const hostelId = localStorage.getItem("hostelId")

  const handleSearch = async () => {
    if (!secretCode.trim()) {
      setError("Please enter a secret code")
      return
    }

    setIsSearching(true)
    setError("")
    setFoundResident(null)

    try {
      const response = await verifyResidentAccessCode(secretCode.trim(), hostelId || undefined)
      setFoundResident(response.data)
      toast.success("Resident verified successfully")
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || "No resident found with this access code"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleCheckIn = async () => {
    if (!foundResident?.id) return

    setIsCheckingIn(true)
    try {
      const response = await checkInResident(foundResident.id)
      setFoundResident(response.data)
      setShowCheckInDialog(false)
      toast.success("Resident checked in successfully")
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || "Failed to check in resident"
      toast.error(errorMessage)
    } finally {
      setIsCheckingIn(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }

  const isCheckedIn = foundResident?.status === "active" && foundResident?.checkInDate
  const residentName = foundResident?.name || foundResident?.user?.name || "N/A"
  const initials = residentName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${iconContainerInfo}`}>
              <Key className="w-5 h-5 text-forest-green-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Resident Lookup</h1>
              <p className="text-xs text-muted-foreground">Verify & check in residents</p>
            </div>
          </div>
          <Button onClick={() => navigate(-1)} variant="outline" size="sm">
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Section */}
          <Card className={floatingCard}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Enter Access Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter 10-character code (e.g., AB12CD34EF)"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                      onKeyDown={handleKeyPress}
                      className="flex-1 font-mono tracking-widest text-lg"
                      disabled={isSearching}
                      maxLength={10}
                    />
                    <Button onClick={handleSearch} disabled={isSearching} size="lg" className="px-8">
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => { setSecretCode(""); setFoundResident(null); setError("") }}
                  variant="outline"
                  disabled={isSearching}
                  className="md:self-end"
                >
                  Clear
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {foundResident && (
            <>
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center justify-between ${
                isCheckedIn
                  ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                  : "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isCheckedIn ? "bg-emerald-100" : "bg-amber-100"
                  }`}>
                    {isCheckedIn ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {isCheckedIn ? "Checked In" : "Not Yet Checked In"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isCheckedIn
                        ? `Since ${new Date(foundResident.checkInDate!).toLocaleDateString()}`
                        : "Verified but awaiting check-in confirmation"
                      }
                    </p>
                  </div>
                </div>
                {!isCheckedIn && (
                  <Button
                    onClick={() => setShowCheckInDialog(true)}
                    disabled={isCheckingIn}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Check In Resident
                  </Button>
                )}
              </div>

              {/* Main Grid Layout */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Profile Card */}
                  <Card className={floatingCard}>
                    <CardContent className="p-6">
                      {/* Avatar & Name */}
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 ring-4 ring-primary/10">
                          <span className="text-2xl font-bold text-primary">{initials}</span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground">{residentName}</h2>
                        {foundResident?.studentId && (
                          <Badge variant="outline" className="mt-1">
                            {foundResident.studentId}
                          </Badge>
                        )}
                      </div>

                      <Separator className="my-4" />

                      {/* Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Gender</p>
                            <p className="font-medium capitalize text-foreground">
                              {foundResident.user?.gender || "N/A"}
                            </p>
                          </div>
                        </div>

                        {foundResident?.course && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Course</p>
                              <p className="font-medium text-foreground">{foundResident.course}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium text-foreground">
                              {foundResident.user?.phone || foundResident.phone || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium text-foreground truncate">
                              {foundResident.user?.email || foundResident.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Room Card */}
                  <Card className={floatingCard}>
                    <CardContent className="p-6">
                      <div className={`flex items-center gap-2 mb-4 ${iconContainerPrimary} inline-flex rounded-lg p-2`}>
                        <Home className="w-5 h-5 text-emerald-700" />
                        <span className="font-semibold text-emerald-700">Room Details</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Room Number</p>
                          <p className="text-2xl font-bold text-foreground">
                            {foundResident?.room?.number || "-"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Block</p>
                            <p className="font-medium text-foreground">
                              {foundResident.room?.block || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Floor</p>
                            <p className="font-medium text-foreground">
                              {foundResident.room?.floor || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                            <Badge variant="secondary" className="capitalize">
                              {foundResident.room?.type}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <Badge
                              variant={foundResident.room?.status === "occupied" ? "destructive" : "default"}
                              className="capitalize"
                            >
                              {foundResident.room?.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{
                                  width: `${((foundResident.room?.currentResidentCount || 0) / (foundResident.room?.maxCap || 1)) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {foundResident.room?.currentResidentCount} / {foundResident.room?.maxCap}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Payment & Actions */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Payment Summary */}
                  <Card className={floatingCard}>
                    <CardContent className="p-6">
                      <div className={`flex items-center gap-2 mb-6 ${iconContainerPrimary} inline-flex rounded-lg p-2`}>
                        <CreditCard className="w-5 h-5 text-emerald-700" />
                        <span className="font-semibold text-emerald-700">Payment Summary</span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-5 text-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                          <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                          <p className="text-2xl font-bold text-emerald-700">
                            {formatCurrency(foundResident?.amountPaid || 0)}
                          </p>
                        </div>

                        <div className="p-5 text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                          <p className="text-sm text-muted-foreground mb-1">Room Price</p>
                          <p className="text-2xl font-bold text-blue-700">
                            {formatCurrency(foundResident.roomPrice || 0)}
                          </p>
                        </div>

                        <div className="p-5 text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                          <p className="text-sm text-muted-foreground mb-1">Balance</p>
                          <p className={`text-2xl font-bold ${
                            (foundResident.balanceOwed || 0) > 0 ? "text-amber-700" : "text-emerald-700"
                          }`}>
                            {foundResident.balanceOwed ? formatCurrency(foundResident.balanceOwed) : "GHS 0.00"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hostel & Actions */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Hostel Info */}
                    <Card className={floatingCard}>
                      <CardContent className="p-6">
                        <div className={`flex items-center gap-2 mb-4 ${iconContainerInfo} inline-flex rounded-lg p-2`}>
                          <Building2 className="w-5 h-5 text-forest-green-700" />
                          <span className="font-semibold text-forest-green-700">Hostel</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Name</p>
                            <p className="font-medium text-foreground">
                              {foundResident.room?.hostel?.name || "N/A"}
                            </p>
                          </div>

                          {foundResident.room?.hostel?.location && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                              <p className="text-sm text-foreground line-clamp-2">
                                {foundResident.room.hostel.location}
                              </p>
                            </div>
                          )}

                          {foundResident.room?.hostel?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm text-foreground">
                                {foundResident.room.hostel.phone}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Access Code Display */}
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Key className="w-5 h-5 text-amber-700" />
                          <span className="font-semibold text-amber-900">Access Code</span>
                        </div>

                        <div className="p-4 bg-white rounded-lg border-2 border-amber-200 text-center">
                          <p className="text-3xl font-mono font-bold text-amber-900 tracking-widest">
                            {secretCode}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground mt-3 text-center">
                          Use this code for resident verification
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!foundResident && !error && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                <Key className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Enter an Access Code</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter the 10-character access code provided to the resident to look up their information.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          SimpleHostel Resident Lookup System
        </div>
      </footer>

      {/* Check-in Confirmation Dialog */}
      <AlertDialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Check-In</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to check in <strong>{residentName}</strong>?
              <br /><br />
              Room: <strong>{foundResident?.room?.number}</strong><br />
              This will mark the resident as active and record the check-in date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCheckingIn}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckIn} disabled={isCheckingIn} className="bg-emerald-600 hover:bg-emerald-700">
              {isCheckingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking In...
                </>
              ) : (
                "Confirm Check-In"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ResidentLookup
