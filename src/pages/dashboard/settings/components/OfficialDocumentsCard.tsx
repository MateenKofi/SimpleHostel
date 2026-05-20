import { useState } from "react";
import { Loader, FileText, Upload, X, ChevronDown, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface OfficialDocumentsCardProps {
  signatureFile: File | null;
  setSignatureFile: (value: File | null) => void;
  stampFile: File | null;
  setStampFile: (value: File | null) => void;
  signaturePreview: string;
  stampPreview: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mutation: {
    isPending: boolean;
    mutate: () => void;
  };
}

export function OfficialDocumentsCard({
  signatureFile,
  setSignatureFile,
  stampFile,
  setStampFile,
  signaturePreview,
  stampPreview,
  isOpen,
  onOpenChange,
  mutation,
}: OfficialDocumentsCardProps) {
  const uploadedCount =
    (signaturePreview || signatureFile ? 1 : 0) + (stampPreview || stampFile ? 1 : 0);

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-primary" />
                Official Documents
              </CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {uploadedCount}/2 uploaded
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
            <CardDescription>
              Upload signatures and stamps for official documents (Allocation Letters,
              Receipts, etc).
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signature Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Manager Signature</h3>
                {signaturePreview && (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Current Signature:</p>
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="h-20 object-contain"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="signature-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3 group-hover:bg-primary/10">
                        <Upload className="w-6 h-6 text-zinc-500 group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-semibold">Upload Signature</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        PNG/JPG (transparent bg recommended)
                      </p>
                      <input
                        id="signature-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </Label>
                  {signatureFile && (
                    <div className="flex items-center justify-between p-2 text-sm border rounded-md bg-primary/10 text-primary border-primary/20">
                      <span className="truncate max-w-[200px]">{signatureFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setSignatureFile(null)}
                        className="text-primary hover:text-destructive transition-colors px-1"
                        aria-label="Remove signature"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stamp Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Hostel Stamp</h3>
                {stampPreview && (
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-2">Current Stamp:</p>
                    <img src={stampPreview} alt="Stamp" className="h-20 object-contain" />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="stamp-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3 group-hover:bg-primary/10">
                        <Upload className="w-6 h-6 text-zinc-500 group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-semibold">Upload Stamp</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        PNG/JPG (transparent bg recommended)
                      </p>
                      <input
                        id="stamp-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setStampFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </Label>
                  {stampFile && (
                    <div className="flex items-center justify-between p-2 text-sm border rounded-md bg-primary/10 text-primary border-primary/20">
                      <span className="truncate max-w-[200px]">{stampFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setStampFile(null)}
                        className="text-primary hover:text-destructive transition-colors px-1"
                        aria-label="Remove stamp"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending || (!signatureFile && !stampFile)}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" /> Uploading...
                  </span>
                ) : (
                  "Upload Documents"
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}