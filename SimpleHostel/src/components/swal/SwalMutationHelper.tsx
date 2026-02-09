import Swal from "sweetalert2";
import type { SweetAlertIcon } from "sweetalert2";
import { toast } from "sonner";
import axios from "axios";

export const showConfirmDialog = async ({
  title = "Are you sure?",
  text = "Do you want to proceed?",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning" as SweetAlertIcon,
} = {}) => {
  return await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
};

export const showLoadingDialog = ({
  title = "Processing...",
  text = "Please wait.",
} = {}) => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showSuccessDialog = ({
  title = "Success!",
  text = "Operation completed successfully.",
} = {}) => {
  Swal.fire({
    title,
    text,
    icon: "success",
  });
};

export const showErrorDialog = ({
  title = "Error!",
  text = "Something went wrong.",
} = {}) => {
  Swal.fire({
    title,
    text,
    icon: "error",
  });
};

export const handleSwalMutation = async ({
  mutation,
  title,
}: {
  mutation: () => Promise<unknown>; 
  title: string;
}) => {
  const result = await Swal.fire({
    title: `Are you sure?`,
    text: `Do you want to ${title.toLowerCase()}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${title.toLowerCase()}!`,
  });

  if (result.isConfirmed) {
    Swal.fire({
      title: `${title}...`,
      text: `Please wait while we ${title.toLowerCase()}.`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      await mutation();
      Swal.fire({
        title: `${title}d!`,
        text: `The item has been ${title.toLowerCase()}ed successfully.`,
        icon: "success",
      });
    } catch (error ) {
      let errorMessage = `Failed to ${title.toLowerCase()} the item. Please try again.`;
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      Swal.fire({
        title: "Error!",
        text: errorMessage || 'An unexpected error occured',
        icon: "error",
      });

    }
  }
};