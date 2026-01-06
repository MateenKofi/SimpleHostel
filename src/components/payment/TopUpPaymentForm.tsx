import { useMutation, useQuery } from "@tanstack/react-query";
import { topupPayment } from "@/api/payments";
import { getResidentBilling } from "@/api/residents";
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
  BadgeCent,
  Receipt,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
import { useAuthStore } from "@/stores/useAuthStore";

const TopUpPaymentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch resident billing data from API
  const { data: billingData, isLoading, isError } = useQuery({
    queryKey: ['resident-billing-topup', user?.id],
    queryFn: async () => {
      const res = await getResidentBilling();
      const data = res?.json || res?.data || res;

      if (!data || !data.summary) {
        throw new Error("Invalid billing data");
      }

      return data;
    },
    enabled: !!user?.id,
    retry: 1
  });

  const summary = billingData?.summary;
  const payments = billingData?.payments || [];

  const mutation = useMutation({
    mutationFn: async () => {
      console.log('Payment mutation triggered');
      console.log('Summary data:', summary);
      console.log('Payments:', payments);

      if (!summary || !user) {
        const errorMsg = "Resident data not available";
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (!summary.balanceOwed || summary.balanceOwed <= 0) {
        const errorMsg = "No outstanding balance to pay";
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        // Get the most recent payment to extract residentId and roomId
        const recentPayment = payments[0];

        const payload = {
          residentId: recentPayment?.residentProfileId || user.id,
          roomId: recentPayment?.roomId,
          initialPayment: summary.balanceOwed,
        };

        console.log('Payment payload:', payload);
        const resData = await topupPayment(payload);
        console.log('Payment response:', resData);

        if (resData?.authorizationUrl) {
          toast(resData.message || "Redirecting to payment...");
          window.location.href = resData.authorizationUrl;
        } else if (resData?.paymentUrl) {
          toast(resData.message || "Redirecting to payment...");
          window.location.href = typeof resData.paymentUrl === 'string'
            ? resData.paymentUrl
            : resData.paymentUrl?.authorizationUrl;
        } else {
          toast.error("No payment URL received from server");
        }

        return resData;
      } catch (error: any) {
        console.error('Payment error:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "An unexpected error occurred";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handlPayment = () => {
    console.log('Pay Now button clicked');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">Failed to load payment information.</p>
        <Button onClick={() => navigate("/dashboard/payment-billing")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Billing
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50/50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-transparent hover:text-primary -ml-3"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Billing
        </Button>

        <Card className="overflow-hidden border shadow-sm">
          {/* Header Section */}
          <div className="p-6 border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border border-gray-100">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                    {getInitials(user?.name || summary?.residentName || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.name || summary?.residentName || ""}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">Student</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm capitalize">
                Active
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Resident Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-gray-900">Resident Details</h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </dt>
                    <dd className="font-medium text-right">{user?.email || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </dt>
                    <dd className="font-medium text-right">{user?.phoneNumber || "-"}</dd>
                  </div>
                </dl>
              </div>

              {/* Room Information */}
              {summary && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-gray-900">Room Details</h3>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <BadgeCheck className="w-3.5 h-3.5" /> Room No
                      </dt>
                      <dd className="font-bold text-lg">{summary?.roomNumber || "-"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <BadgeCent className="w-3.5 h-3.5" /> Price
                      </dt>
                      <dd className="font-medium text-primary">GH₵{summary?.roomPrice?.toLocaleString() || "0"}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mt-8 pt-8 border-t">
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">Payment Summary</h2>
                  <p className="text-muted-foreground text-sm">Clear your outstanding balance</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="font-bold">GH₵{summary?.roomPrice?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Paid</p>
                      <p className="font-bold text-green-600">GH₵{summary?.totalAmountPaid?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Balance</p>
                      <p className="font-bold text-red-600">GH₵{summary?.balanceOwed?.toLocaleString() || "0"}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-900">Amount Due Now</span>
                    <span className="text-3xl font-bold text-primary">
                      GH₵{summary?.balanceOwed?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => handlPayment()}
                  disabled={mutation.isPending}
                  size="lg"
                  className="w-full text-lg font-semibold h-12"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 border-t p-4 px-8 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-3.5 h-3.5" />
              <span>Secured Transaction</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TopUpPaymentForm;
