"use client";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import { useModal } from "@/components/Modal";
import AmenitiesModal from "./AmenitiesModal";
import EditAmenitiesModal from "./EditAmenitiesModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { getHostelAmenities, deleteAmenity } from "@/api/amenities";
import { toast } from "sonner";
import { useState } from "react";
import CustomDataTable from "@/components/CustomDataTable";
import { Amenity } from "@/helper/types/types";
import type { ApiError } from "@/types/dtos";
import { Button } from "@/components/ui/button";

const Amenities = () => {
  const queryClient = useQueryClient();
  const { open: openAmenitiesModal, close: closeAmenitiesModal } =
    useModal("amenities_modal");
  const { open: openEditAmenitiesModal, close: closeEditAmenitiesModal } =
    useModal("edit_amenities_modal");
  const hostelId = localStorage.getItem("hostelId");
  const [deletingAmenityId, setDeletingAmenityId] = useState<string | null>(
    null
  );
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  const {
    data: amenities,
    isLoading,
    isError,
    refetch: refetchAmenities,
  } = useQuery({
    queryKey: ["amenities"],
    queryFn: async () => {
      if (!hostelId) return null;
      return await getHostelAmenities(hostelId);
    },
  });

  const DeleteAmenitiesMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteAmenity(id);
    },
    onSuccess: () => {
      toast.success("Amenity deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      setDeletingAmenityId(null);
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete amenity";
      toast.error(errorMessage);
    },
  });

  const handleDeleteAmenities = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this amenities!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingAmenityId(id);
        DeleteAmenitiesMutation.mutate(id);
      }
    });
  };

  const handleEditAmenities = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    openEditAmenitiesModal();
  };

  const columns = [
    {
      name: "Name",
      selector: (row: { name: string }) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      cell: (row: { price: number }) => `GHC ${row.price}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Amenity) => (
        <div className="flex gap-2 text-nowrap">
          <Button
            size="sm"
            onClick={() => handleEditAmenities(row)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteAmenities(row.id)}
            disabled={deletingAmenityId === row.id}
          >
            {deletingAmenityId === row.id ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AmenitiesModal onClose={closeAmenitiesModal} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <Button size="sm" onClick={() => openAmenitiesModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Amenity
        </Button>
      </div>

      {amenities?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full gap-4 py-12 text-center border border-dashed rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No amenities found. Please add some amenities.</p>
          <Button onClick={() => openAmenitiesModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Amenity
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
          <CustomDataTable
            title="Amenities Table"
            columns={columns}
            data={amenities?.data}
            isError={isError}
            isLoading={isLoading}
            refetch={refetchAmenities}
          />
        </div>
      )}
      <EditAmenitiesModal
        onClose={closeEditAmenitiesModal}
        formdata={selectedAmenity || { id: "", name: "", price: 0 }}
      />
    </>
  );
};

export default Amenities;
