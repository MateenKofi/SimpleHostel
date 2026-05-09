import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHostels, deleteHostel, updateHostelRules } from "@/api/hostels";
import { Hostel } from "@/helper/types/types";
import { TableColumn } from "react-data-table-component";
import CustomDataTable from "./CustomDataTable";
import { Trash2, FileText, Upload, Loader2 as Loader, MapPin } from "lucide-react";
import { toast } from "sonner";
import { handleSwalMutation } from "./swal/SwalMutationHelper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiError } from "@/types/dtos";
import { LocationPicker } from "./maps/LocationPicker";
import { updateHostel } from "@/api/hostels";

const HostelManagementTable = () => {
  const {
    data: AllHostels,
    isLoading,
    isError,
    refetch: refetchAllHostels,
  } = useQuery({
    queryKey: ["AllHostels"],
    queryFn: async () => {
      const responseData = await getHostels();
      return responseData.data;
    },
  });

  const DeleteHostelMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteHostel(id);
        toast.success("Hostel deleted successfully");
        refetchAllHostels();
      } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err?.response?.data?.error || "Failed to delete hostel";
        toast.error(errorMessage);
        throw error;
      }
    },
  });

  const handleDeleteHostel = (id: string) => {
    handleSwalMutation({
      mutation: () => DeleteHostelMutation.mutateAsync(id),
      title: "delete hostel",
    });
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const UploadRulesMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("rules", file);
      return await updateHostelRules(id, formData);
    },
    onSuccess: () => {
      toast.success("Hostel rules updated successfully");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setSelectedHostelId(null);
      refetchAllHostels();
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.error || error.message || "Failed to upload rules";
      toast.error(errorMessage);
    },
  });

  const handleUploadClick = (id: string) => {
    setSelectedHostelId(id);
    setIsUploadModalOpen(true);
  };

  const handleEditLocationClick = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setIsLocationModalOpen(true);
  };

  const UpdateLocationMutation = useMutation({
    mutationFn: async (data: { id: string; lat: number; lng: number; address: string }) => {
      const formData = new FormData();
      formData.append("latitude", data.lat.toString());
      formData.append("longitude", data.lng.toString());
      formData.append("address", data.address);
      return await updateHostel(data.id, formData);
    },
    onSuccess: () => {
      toast.success("Hostel location updated successfully");
      setIsLocationModalOpen(false);
      refetchAllHostels();
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.error || "Failed to update location");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedHostelId && selectedFile) {
      UploadRulesMutation.mutate({ id: selectedHostelId, file: selectedFile });
    }
  };

  const columns: TableColumn<Hostel>[] = [
    { name: "Hostel", selector: (row) => row.name, sortable: true, wrap: true },
    {
      name: "Location",
      cell: (row) => <span>{(row.location) || "N/A"}</span>,
    },
    { name: "Email", wrap: true, selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone },
    { name: "State", selector: (row) => row.state },
    {
      name: "Action",
      center: true,
      cell: (row) => (
        <span className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditLocationClick(row)}
            title="Edit Location"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <MapPin className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUploadClick(row.id)}
            title="Upload Rules"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <button
            className="px-2 py-1 text-white bg-red-500 rounded-md"
            onClick={() => handleDeleteHostel(row.id)}
            title="Delete Hostel"
          >
            <Trash2 size={16} />
          </button>
        </span>
      ),
      sortable: true,
    },
  ];
  return (
    <div className="p-6 border rounded-md shadow-sm">
      <CustomDataTable
        title="Hostel Management Table"
        data={AllHostels}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Hostel Rules & Regulations</DialogTitle>
            <DialogDescription>
              Upload a PDF or document containing the rules for this hostel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rules">Rules Document</Label>
              <Input
                id="rules"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={UploadRulesMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={!selectedFile || UploadRulesMutation.isPending}
            >
              {UploadRulesMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Hostel Location</DialogTitle>
            <DialogDescription>
              Drag the pin or search for an address to update <strong>{selectedHostel?.name}</strong>'s coordinates.
            </DialogDescription>
          </DialogHeader>
          
          {selectedHostel && (
            <div className="py-4">
              <LocationPicker 
                latitude={selectedHostel.latitude || undefined}
                longitude={selectedHostel.longitude || undefined}
                address={selectedHostel.address}
                onLocationChange={(lat, lng) => {
                  setSelectedHostel(prev => prev ? { ...prev, latitude: lat, longitude: lng } : null);
                }}
                onAddressChange={(addr) => {
                  setSelectedHostel(prev => prev ? { ...prev, address: addr } : null);
                }}
                height="350px"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocationModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedHostel) {
                  UpdateLocationMutation.mutate({
                    id: selectedHostel.id,
                    lat: selectedHostel.latitude!,
                    lng: selectedHostel.longitude!,
                    address: selectedHostel.address,
                  });
                }
              }}
              disabled={UpdateLocationMutation.isPending || !selectedHostel?.latitude}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {UpdateLocationMutation.isPending ? <Loader className="w-4 h-4 animate-spin mr-2" /> : "Save Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelManagementTable;
