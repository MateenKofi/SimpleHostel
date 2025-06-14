import React, { useState } from 'react';
import { Globe, EyeOff, Eye,CheckCircle } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface AwardStatusAlertProps {
  status: 'published' | 'unpublished';
}

type AlertType = "info" | "success";

const alertBgColors: Record<AlertType, string> = {
  info: 'bg-red-100',
  success: 'bg-green-100',
};

const StatusAlert: React.FC<AwardStatusAlertProps> = ({ status }) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const PublishHostelMutation = useMutation({
    mutationFn: async () => {
      const hostelId = localStorage.getItem('hostelId');
      const response = await axios.put(`/api/hostels/publish/${hostelId}`,{}); 
      return response?.data;
    },
    onSuccess: () => {
      toast.success('Hostel published successfully');
      queryClient.invalidateQueries({ queryKey: ['hostel'] });
    },
    onError: (error: AxiosError<{message:string}>) => { 
        const errorMessage = error.response?.data?.message || 'Failed to publish hostel';
        toast.error(errorMessage);
    },
  });

  const UnpublishHostelMutation = useMutation({
    mutationFn: async () => {
      const hostelId = localStorage.getItem('hostelId');
      const response = await axios.put(`/api/hostels/unpublish/${hostelId}`,{}); 
      return response?.data;
    },
    onSuccess: () => {
      toast.success('Hostel unpublished successfully');
      queryClient.invalidateQueries({ queryKey: ['hostel'] });
    },
    onError: (error: AxiosError<{message:string}>) => { 
        const errorMessage = error.response?.data?.message || 'Failed to unpublish hostel';
        toast.error(errorMessage);
    },
  });

  const handlePublish = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to publish the Rooms?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, publish!',
    });

    if (result.isConfirmed) {
      Swal.showLoading();
      await PublishHostelMutation.mutateAsync();
      Swal.close();
    }
  };

  const handleUnpublish = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to unpublish the Rooms?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unpublish!',
    });

    if (result.isConfirmed) {
      Swal.showLoading();
      await UnpublishHostelMutation.mutateAsync();
      Swal.close();
    }
  };

  const handleUpdateResultsStatus = async () => {
    if (showResults) {
      await handleUnpublish();
    } else {
      await handlePublish();
    }
    setShowResults(!showResults);
  };

  const getAlertConfig = (): { type: AlertType; title: string; description: string; icon: JSX.Element; action: JSX.Element } | null => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED':
        return {
          type: 'success',
          title: 'Rooms Published',
          description: 'The rooms have been published. Click to unpublish.',
          icon: <Globe className="w-5 h-5 text-green-700" />,
          action: (
            <button
              className="mt-2 btn btn-success btn-sm"
              onClick={handleUpdateResultsStatus}
              disabled={isLoading}
            >
              <EyeOff className="w-4 h-4 mr-2 text-white" />
              <span className='text-white'>Unpublish Rooms</span>
            </button>
          ),
        };
      case 'UNPUBLISHED':
        return {
          type: 'info',
          title: 'Rooms Unpublished',
          description: 'The rooms are currently unpublished. Residents won\'t be able to find rooms on room finder. Click to publish.',
          icon: <CheckCircle className="w-5 h-5 text-blue-700" />,
          action: (
            <button
              className="mt-2 text-white btn btn-error btn-sm"
              onClick={handleUpdateResultsStatus}
              disabled={isLoading}
            >
              <Eye className="w-4 h-4 mr-2 text-white" />
              <span className='text-white'>Publish Rooms</span>
            </button>
          ),
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <div className={`mb-4 ${alertBgColors[config.type]} text-black border-none shadow-sm p-4 rounded-md`}>
      <div className="flex items-start w-full gap-2">
        {config.icon}
        <div className="flex-1 text-left">
          <h3 className="font-bold">{config.title}</h3>
          <div className="text-sm">{config.description}</div>
          <div>{config.action}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusAlert;