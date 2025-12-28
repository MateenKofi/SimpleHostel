"use client"

import { useState } from "react"
import { Search, User, Home, Phone, Mail, CreditCard, AlertCircle, Loader2, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { Resident } from "@/helper/types/types"
import CustomeRefetch from "@/components/CustomeRefetch"
import { useNavigate } from "react-router-dom"



const ResidentLookup = () => {
  const navigate = useNavigate()
  const [secretCode, setSecretCode] = useState("")
  const [foundResident, setFoundResident] = useState<Resident | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string>("")
  const hostelId = localStorage.getItem("hostelId");
  const { data: residentsData, isLoading, isError, refetch } = useQuery({
    queryKey: ["residents_lookup"],
    queryFn: async () => {
      const response = await axios.get(`/api/residents/hostel/${hostelId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response?.data?.data;
    },
  })

  if (isError) {
    return <CustomeRefetch refetch={refetch} />
  }

  const handleSearch = () => {
    if (!secretCode.trim()) {
      setError("Please enter a secret code")
      return
    }

    setIsSearching(true)
    const resident = residentsData?.find((resident: Resident) => resident.accessCode === secretCode.trim())

    if (resident) {
      setFoundResident(resident)
    } else {
      setFoundResident(null)
      toast("No resident found with this access code")
    }
    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHC",
    }).format(amount)
  }


  return (
    <div className="max-w-4xl p-6 mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Resident Lookup</h1>
        <p className="text-muted-foreground">Enter your secret access code to view your information</p>
      </div>
      <div>
        <Button onClick={() => navigate(-1)}>
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
          <CardDescription>Enter your unique access code to retrieve your resident information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter secret code (e.g., ND1K5YPRUA)"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="px-6">
              {isSearching ? "Searching..." : "Search"}
            </Button>
            <Button onClick={() => setSecretCode("")} className="px-6">
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
      {isLoading ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center text-muted-foreground">
              <Loader2 className="w-10 h-10 mr-2 animate-spin" />
              <span className="">Fetching Residents ...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {foundResident && (
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
                      <p className="text-lg font-semibold">{foundResident.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                        <p className="font-medium">{foundResident.studentId || "N/A"}</p>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <Badge variant="outline">{foundResident.gender || "N/A"}</Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Course</label>
                      <p className="font-medium">{foundResident.course || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{foundResident.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{foundResident.email}</span>
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
                      <p className="text-sm text-muted-foreground">{foundResident.room?.description}</p>
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
                        {formatCurrency(foundResident.roomPrice)}
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

              {/* Emergency Contact */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="font-medium">{foundResident.emergencyContactName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="font-medium">{foundResident.emergencyContactPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                      <p className="font-medium">{foundResident.relationship}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ResidentLookup