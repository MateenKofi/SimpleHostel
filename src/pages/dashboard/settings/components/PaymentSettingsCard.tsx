import { UseFormReturn } from "react-hook-form";
import { Loader, Settings2, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { settingsFormSchema, type SettingsFormValues } from "@/schemas/settingsSchema";

interface PaymentSettingsCardProps {
  form: UseFormReturn<SettingsFormValues>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mutation: {
    isPending: boolean;
    mutate: (data: { allowPartialPayment: boolean; partialPaymentPercentage: number }) => void;
  };
  onSubmit: (values: SettingsFormValues) => void;
}

export function PaymentSettingsCard({
  form,
  isOpen,
  onOpenChange,
  mutation,
  onSubmit,
}: PaymentSettingsCardProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure booking payment options</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    form.watch("allowPartialPayment")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {form.watch("allowPartialPayment") ? (
                    <>
                      <Check className="w-3 h-3" /> Enabled
                    </>
                  ) : (
                    "Disabled"
                  )}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            <FormField
              control={form.control}
              name="allowPartialPayment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Partial Payment</FormLabel>
                    <FormDescription>
                      Enable residents to pay a deposit instead of full amount during booking.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("allowPartialPayment") && (
              <div className="p-4 border border-primary/10 rounded-lg bg-primary/5">
                <FormField
                  control={form.control}
                  name="partialPaymentPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partial Payment Percentage (%)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            className="w-32 bg-background"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            min={0}
                            max={100}
                          />
                          <span className="text-sm text-muted-foreground">
                            The resident will pay {field.value}% of the total price as deposit.
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => onSubmit(form.getValues())}
                disabled={mutation.isPending}
                variant="outline"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Update Payment Settings"
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}