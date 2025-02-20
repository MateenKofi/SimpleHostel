import React, { useState } from 'react';
import { Globe, EyeOff, Eye,CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface AwardStatusAlertProps {
  status: 'published' | 'unpublished';
}

type AlertType = "info" | "success";

const alertBgColors: Record<AlertType, string> = {
  info: 'bg-sky-200',
  success: 'bg-green-100',
};

const StatusAlert: React.FC<AwardStatusAlertProps> = ({ status }) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const eventId = localStorage.getItem('eventId');
  const queryClient = useQueryClient();

  const UpdateResultStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await axios.post(`/api/v3/admin/award/update-results`, {
        award_id: eventId,
        status: newStatus,
        _method: 'PUT',
      });
      return response?.data;
    },
    onSuccess: () => {
      toast.success('Event status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Failed to update Event status';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to update Event status');
      }
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
      UpdateResultStatusMutation.mutateAsync('published');
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
      UpdateResultStatusMutation.mutateAsync('unpublished');
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
    switch (status.toUpperCase()) {
      case 'PUBLISHED':
        return {
          type: 'success',
          title: 'Rooms Published',
          description: 'The rooms have been published. Click to unpublish.',
          icon: <Globe className="h-5 w-5 text-green-700" />,
          action: (
            <button
              className="btn btn-success btn-sm mt-2"
              onClick={handleUpdateResultsStatus}
              disabled={isLoading}
            >
              <EyeOff className="mr-2 h-4 w-4 text-white" />
              <span className='text-white'>Unpublish Rooms</span>
            </button>
          ),
        };
      case 'UNPUBLISHED':
        return {
          type: 'info',
          title: 'Rooms Unpublished',
          description: 'The rooms are currently unpublished. Residents won\'t be able to find rooms on room finder. Click to publish.',
          icon: <CheckCircle className="h-5 w-5 text-blue-700" />,
          action: (
            <button
              className="btn btn-info text-white btn-sm mt-2"
              onClick={handleUpdateResultsStatus}
              disabled={isLoading}
            >
              <Eye className="mr-2 h-4 w-4 text-white" />
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
      <div className="flex gap-2 items-start w-full">
        {config.icon}
        <div className="text-left flex-1">
          <h3 className="font-bold">{config.title}</h3>
          <div className="text-sm">{config.description}</div>
          <div>{config.action}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusAlert;