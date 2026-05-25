import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, FileText, LucideCircleArrowOutUpRight, Upload, ChevronDown, ChevronRight, Check } from "lucide-react";
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

interface RulesRegulationsCardProps {
  hostelData?: {
    rulesUrl?: string | null;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mutation: {
    isPending: boolean;
    mutate: (file: File) => void;
  };
}

export function RulesRegulationsCard({
  hostelData,
  isOpen,
  onOpenChange,
  mutation,
}: RulesRegulationsCardProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = () => {
    if (file) {
      mutation.mutate(file);
      setFile(null);
    }
  };

  const handleCancel = () => {
    setFile(null);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-primary" />
                Rules & Regulations
              </CardTitle>
              <div className="flex items-center gap-3">
                {hostelData?.rulesUrl && (
                  <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Uploaded
                  </span>
                )}
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
          <CardContent className="space-y-4 pt-0">
            <CardDescription>
              Upload the hostel's rules and regulations for residents to view.
            </CardDescription>

            {hostelData?.rulesUrl && (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Current Rules Document</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (hostelData.rulesUrl) {
                          window.open(hostelData.rulesUrl, "_blank");
                        }
                      }}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      View current version <LucideCircleArrowOutUpRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              {!file && (
                <Label htmlFor="rules-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
                      <Upload className="w-6 h-6 text-zinc-500" />
                    </div>
                    <p className="text-sm font-semibold">Click or drag to upload rules</p>
                    <p className="text-xs text-zinc-500 mt-1">Accepts PDF files (max 5MB)</p>
                    <input
                      id="rules-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </Label>
              )}

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border border-primary/20 bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium truncate max-w-[250px]">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleUpload}
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" /> Uploading...
                        </span>
                      ) : (
                        "Upload PDF"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
