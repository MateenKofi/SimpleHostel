import { useState, useEffect } from "react";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { resolveAccount } from "@/api/paystack";
import { cn } from "@/lib/utils";

interface AccountVerifierProps {
  bankCode: string;
  accountNumber: string;
  onVerified: (accountName: string) => void;
  onVerificationError: (error: string) => void;
  disabled?: boolean;
}

export function AccountVerifier({
  bankCode,
  accountNumber,
  onVerified,
  onVerificationError,
  disabled = false,
}: AccountVerifierProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const [accountName, setAccountName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!bankCode || accountNumber.length < 10 || disabled) {
        setStatus("idle");
        setAccountName("");
        return;
      }

      setStatus("verifying");

      try {
        const result = await resolveAccount(bankCode, accountNumber);
        setAccountName(result.accountName);
        setStatus("verified");
        onVerified(result.accountName);
        setErrorMessage("");
        onVerificationError("");
      } catch (error: any) {
        setStatus("error");
        setAccountName("");
        const errorMsg = error.response?.data?.error || "Invalid account number";
        setErrorMessage(errorMsg);
        onVerificationError(errorMsg);
      }
    };

    const debounce = setTimeout(verifyAccount, 500);
    return () => clearTimeout(debounce);
  }, [bankCode, accountNumber, disabled]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Account Name</label>
        {status === "verifying" && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {status === "verified" && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Check className="w-3 h-3" /> Verified
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <X className="w-3 h-3" /> Invalid
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 mt-1 text-sm border rounded-md bg-muted/30",
          status === "verified" && "border-green-200 bg-green-50",
          status === "error" && "border-destructive bg-destructive/5"
        )}
      >
        {status === "idle" && (
          <span className="text-muted-foreground">
            Enter account number to verify
          </span>
        )}
        {status === "verifying" && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Verifying account...</span>
          </>
        )}
        {status === "verified" && (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-700">{accountName}</span>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-destructive">{errorMessage}</span>
          </>
        )}
      </div>
    </div>
  );
}