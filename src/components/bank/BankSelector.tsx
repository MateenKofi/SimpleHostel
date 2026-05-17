import { useState } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanks, PaystackBank } from "@/api/paystack";
import { cn } from "@/lib/utils";

interface BankSelectorProps {
  value: string;
  onChange: (bankCode: string, bankName: string) => void;
  disabled?: boolean;
  error?: string;
}

export function BankSelector({
  value,
  onChange,
  disabled = false,
  error,
}: BankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: banks = [], isLoading } = useQuery<PaystackBank[]>({
    queryKey: ["paystack-banks"],
    queryFn: getBanks,
    staleTime: 1000 * 60 * 60, // cache for 1 hour
  });

  const selectedBank = banks.find((b) => b.code === value);

  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase()) ||
      bank.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (bank: PaystackBank) => {
    onChange(bank.code, bank.name);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 mt-1 text-sm border rounded-md bg-background",
          "hover:bg-muted transition-colors",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
      >
        <span className={selectedBank ? "text-foreground" : "text-muted-foreground"}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading banks...
            </span>
          ) : selectedBank ? (
            selectedBank.name
          ) : (
            "Select a bank"
          )}
        </span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search banks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[200px] overflow-y-auto">
            {filteredBanks.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No banks found
              </div>
            ) : (
              filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => handleSelect(bank)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors",
                    value === bank.code && "bg-muted"
                  )}
                >
                  <span className="font-medium">{bank.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}