import { useState } from "react";
import Modal from "@/components/Modal";
import { TextInput, FormButton } from "@/components/form";
import { DebtorDto } from "@/types/dtos";
import { adminInitiateResidentPayment, cashTopupPayment, confirmCashPayment } from "@/api/payments";
import { Wallet, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DebtorPaymentModalProps {
  debtor: DebtorDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "online" | "cash";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: "online", label: "Online (Paystack)", icon: CreditCard },
  { value: "cash", label: "Cash", icon: DollarSign },
];

export default function DebtorPaymentModal({ debtor, onClose, onSuccess }: DebtorPaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>(debtor?.balanceOwed?.toString() || "0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCashConfirm, setShowCashConfirm] = useState(false);
  const [cashPaymentRef, setCashPaymentRef] = useState<string>("");

  if (!debtor) return null;

  const amount = parseFloat(paymentAmount) || 0;
  const isValidAmount = amount > 0;

  const handleClose = () => {
    setShowCashConfirm(false);
    setCashPaymentRef("");
    onClose();
  };

  const handleOnlinePayment = async () => {
    if (!isValidAmount) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await adminInitiateResidentPayment(debtor.id, amount);

      if (result?.authorizationUrl) {
        toast.success("Redirecting to payment...");
        // Redirect to Paystack
        window.location.href = result.authorizationUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || "Failed to initiate payment";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPaymentInit = async () => {
    if (!isValidAmount) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await cashTopupPayment({
        residentId: debtor.id,
        roomId: null,
        initialPayment: amount,
        paymentMethod: "cash",
      });

      if (result?.reference) {
        setCashPaymentRef(result.reference);
        setShowCashConfirm(true);
        toast.success("Cash payment initiated. Please confirm once you've received the cash.");
      } else {
        toast.error("Failed to initiate cash payment. Please try again.");
      }
    } catch (error: unknown) {
      console.error('Cash payment initiation error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || "Failed to initiate cash payment";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmCashPayment = async () => {
    if (!cashPaymentRef) return;

    setIsProcessing(true);

    try {
      await confirmCashPayment(cashPaymentRef);
      toast.success("Cash payment confirmed successfully!");
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      console.error('Cash payment confirmation error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || "Failed to confirm cash payment";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "online") {
      handleOnlinePayment();
    } else {
      handleCashPaymentInit();
    }
  };

  return (
    <Modal modalId="debtor_payment_modal" onClose={handleClose} size="medium">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Record Payment</h2>
          <p className="text-sm text-muted-foreground">
            Record a payment for {debtor.name}
          </p>
        </div>

        {/* Resident Information Section */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Resident Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium text-foreground">{debtor.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Student ID</p>
              <p className="font-medium text-foreground">{debtor.studentId || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground break-all">{debtor.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Room</p>
              <p className="font-medium text-foreground">
                {debtor.roomNumber ? `${debtor.roomNumber} (${debtor.roomType || "N/A"})` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room Price</span>
              <span className="font-medium text-foreground">₦{debtor.roomPrice?.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium text-foreground">₦{debtor.amountPaid?.toLocaleString() || "0"}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Balance Owed</span>
              <span className="font-bold text-destructive">₦{debtor.balanceOwed?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        {!showCashConfirm ? (
          <div className="space-y-4">
            {/* Payment Amount */}
            <TextInput
              label="Payment Amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              helperText="Enter the amount to be paid. You can enter partial payment or full balance."
              error={amount <= 0 ? "Amount must be greater than 0" : undefined}
              disabled={isProcessing}
            />

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.value;
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      disabled={isProcessing}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border p-4 text-sm font-medium transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <FormButton
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                Cancel
              </FormButton>
              <FormButton
                onClick={handleSubmit}
                disabled={!isValidAmount || isProcessing}
                loading={isProcessing}
                loadingText={paymentMethod === "online" ? "Processing..." : "Initiating..."}
                className="w-full sm:w-auto"
              >
                {paymentMethod === "online" ? "Pay Online" : "Record Cash Payment"}
              </FormButton>
            </div>
          </div>
        ) : (
          /* Cash Payment Confirmation */
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cash Payment Initiated
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono font-medium text-foreground">{cashPaymentRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">₦{amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Have you received the cash payment of <strong>₦{amount.toLocaleString()}</strong> from this resident?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <FormButton
                variant="outline"
                onClick={() => {
                  setShowCashConfirm(false);
                  toast.info("You can confirm the payment later from the payments list.");
                  onSuccess();
                  handleClose();
                }}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                Confirm Later
              </FormButton>
              <FormButton
                onClick={handleConfirmCashPayment}
                disabled={isProcessing}
                loading={isProcessing}
                loadingText="Confirming..."
                className="w-full sm:w-auto"
              >
                Yes, Confirm Payment
              </FormButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
