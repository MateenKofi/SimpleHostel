"use client"

import { useState } from "react"
import { Search, User, Home, Phone, Mail, CreditCard, AlertCircle, Loader2, ChevronLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "No resident found with this access code"
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
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to check in resident"
      toast.error(errorMessage)
    } finally {
      setIsCheckingIn(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHC",
    }).format(amount)
  }

  const isCheckedIn = foundResident?.status === "active" && foundResident?.checkInDate

  return (
    <div className="max-w-4xl p-6 mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Resident Lookup</h1>
        <p className="text-muted-foreground">Enter your secret access code to view resident information</p>
      </div>
      <div>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Access Code Search
          </CardTitle>
          <CardDescription>Enter the unique access code to retrieve resident information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter secret code (e.g., ND1K5YPRUA)"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyPress}
              className="flex-1 font-mono tracking-wider"
              disabled={isSearching}
              maxLength={10}
            />
            <Button onClick={handleSearch} disabled={isSearching} className="px-6">
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button onClick={() => { setSecretCode(""); setFoundResident(null); setError("") }} variant="outline" disabled={isSearching}>
              Clear
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {foundResident && (
        <div className="space-y-4">
          {/* Check-in Status Banner */}
          {isCheckedIn ? (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Checked In</strong> on {new Date(foundResident.checkInDate!).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Resident verified but not yet checked in. Use the check-in button below.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg font-semibold">{foundResident.name || foundResident.user?.name || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                      <p className="font-medium">{foundResident.studentId || "N/A"}</p>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <Badge variant="outline">{foundResident.user?.gender || "N/A"}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Course</label>
                    <p className="font-medium">{foundResident.course || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{foundResident.user?.phone || foundResident.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{foundResident.user?.email || foundResident.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Room Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Room Number</label>
                    <p className="text-lg font-semibold">{foundResident?.room?.number || "-"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Block</label>
                      <p className="font-medium">{foundResident.room?.block || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Floor</label>
                      <p className="font-medium">{foundResident.room?.floor || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start gap-1">
                      <label className="text-sm font-medium text-muted-foreground">Room Type</label>
                      <Badge variant="secondary">{foundResident.room?.type}</Badge>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge variant={foundResident.room?.status === "occupied" ? "destructive" : "default"}>
                        {foundResident.room?.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                    <p className="font-medium">
                      {foundResident.room?.currentResidentCount} / {foundResident.room?.maxCap} residents
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm text-muted-foreground">{foundResident.room?.description || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 text-center rounded-lg bg-green-50 dark:bg-green-950">
                    <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(foundResident?.amountPaid || 0)}
                    </p>
                  </div>

                  <div className="p-4 text-center rounded-lg bg-blue-50 dark:bg-blue-950">
                    <p className="text-sm font-medium text-muted-foreground">Room Price</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(foundResident.roomPrice || 0)}
                    </p>
                  </div>

                  <div className="p-4 text-center rounded-lg bg-orange-50 dark:bg-orange-950">
                    <p className="text-sm font-medium text-muted-foreground">Balance Owed</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {foundResident.balanceOwed ? formatCurrency(foundResident.balanceOwed) : "GHC 0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check-in Action */}
            {!isCheckedIn && (
              <Card className="md:col-span-2 border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Check-In Resident</h3>
                      <p className="text-sm text-muted-foreground">
                        Confirm that {foundResident.name || foundResident.user?.name} has arrived and is ready to check in.
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowCheckInDialog(true)}
                      disabled={isCheckingIn}
                      className="px-6"
                    >
                      {isCheckingIn ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Checking In...
                        </>
                      ) : (
                        "Check In Resident"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Check-in Confirmation Dialog */}
      <AlertDialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Check-In</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to check in <strong>{foundResident?.name || foundResident?.user?.name}</strong>?
              <br /><br />
              Room: <strong>{foundResident?.room?.number}</strong><br />
              This will mark the resident as active and record the check-in date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCheckingIn}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckIn} disabled={isCheckingIn}>
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
