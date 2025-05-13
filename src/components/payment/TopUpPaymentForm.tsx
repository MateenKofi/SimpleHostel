import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  Loader2,
  ChevronLeft,
  User,
  Home,
  CreditCard,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Users,
  Flag,
  DollarSign,
  Receipt,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAddedResidentStore } from "@/controllers/AddedResident";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const TopUpPaymentForm = () => {
  const navigate = useNavigate();
  const resident = useAddedResidentStore((s) => s.resident)!;

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const payload = {
          residentId: resident.id,
          roomId: resident.roomId,
          initialPayment: resident.balanceOwed,
        };
        const res = await axios.post("/api/payments/topup", payload);
        toast(res.data.message || "Redirecting to payment...");
        window.location.href = res.data.paymentUrl
        navigate("/dashboard/deptors-list");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data.error || "An unexpected error occurred"
          );
        }
      }
    },
  });

  const handlPayment = () => {
    mutation.mutate();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-black via-indigo-600 to-gray-600 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge
              variant="outline"
              className="text-white border-white/30 px-3 py-1"
            >
              {resident?.room?.status || "PENDING"}
            </Badge>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarFallback className="bg-indigo-800 text-white text-xl">
                {getInitials(resident?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {resident?.name || ""}
              </h1>
              <div className="flex items-center gap-2 text-indigo-100">
                <GraduationCap className="h-4 w-4" />
                <span>{resident?.studentId || ""}</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resident Information */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-100">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Resident Details
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Course:</dt>
                    <dd className="font-medium">{resident?.course || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Email:</dt>
                    <dd className="font-medium">{resident?.email || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Phone:</dt>
                    <dd className="font-medium">{resident?.phone || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Gender:</dt>
                    <dd className="font-medium">{resident?.gender || ""}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-gray-500" />
                    <dt className="w-24 text-gray-500">Nationality:</dt>
                    <dd className="font-medium">Ghanaian</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Room Information */}
            {resident?.room && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <Home className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg font-medium">
                      Room Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Room No:</dt>
                      <dd className="font-medium">
                        {resident?.room?.number || ""}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Block:</dt>
                      <dd className="font-medium">
                        {resident?.room?.block || ""}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Type:</dt>
                      <dd className="font-medium">
                        {resident?.room?.type || ""}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Price:</dt>
                      <dd className="font-medium text-green-600">
                        GH₵{resident?.room?.price?.toLocaleString() || ""}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <dt className="w-24 text-gray-500">Floor:</dt>
                      <dd className="font-medium">
                        {resident?.room?.floor || ""}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Summary */}

          <Card className="border shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-100">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium">
                  Payment Summary
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-xl font-bold text-gray-900">
                    GH₵{resident?.roomPrice?.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-500"> Amount Paid</div>
                  <div className="text-xl font-bold text-gray-900">
                    GH₵{resident?.amountPaid?.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-500">Balance Owed</div>
                  <div className="text-xl font-bold text-red-600">
                    GH₵{resident?.balanceOwed?.toLocaleString()}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => handlPayment()}
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay GH₵{resident?.balanceOwed?.toLocaleString()}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="bg-gray-50 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Payment due: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flag className="h-4 w-4" />
            <span>Ghana</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TopUpPaymentForm;
