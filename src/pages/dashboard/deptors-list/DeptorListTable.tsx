import React, { useState } from 'react';
import CustomDataTable from '@/components/CustomDataTable';
import { useQuery } from '@tanstack/react-query';
import { getDebtorsPaginated } from '@/api/residents';
import { adminInitiateResidentPayment } from '@/api/payments';
import { DebtorDto } from '@/types/dtos';
import { useAddedResidentStore } from '@/stores/useAddedResidentStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const DebtorListTable: React.FC = () => {
  const navigate = useNavigate()
  const setResident = useAddedResidentStore((state) => state.setResident)
  const [selectedDebtor, setSelectedDebtor] = useState<DebtorDto | null>(null);
  const [processingDebtorId, setProcessingDebtorId] = useState<string | null>(null);
  const hostelId = localStorage.getItem('hostelId')

  const {
    data: debtorsResponse,
    isLoading,
    isError,
    refetch: refetchDebtors,
  } = useQuery({
    queryKey: ["debtors", hostelId],
    queryFn: async () => {
      if (!hostelId) return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
      return await getDebtorsPaginated({ hostelId })
    },
    enabled: !!hostelId,
  });

  const debtors = debtorsResponse?.data ?? [];

  const handlePayment = async (row: DebtorDto) => {
    // Validate that the debtor has a balance owed
    if (!row.balanceOwed || row.balanceOwed <= 0) {
      toast.error("This resident has no outstanding balance to pay.");
      return;
    }

    setProcessingDebtorId(row.id);

    try {
      // Initiate payment for the full balance owed
      const result = await adminInitiateResidentPayment(
        row.id,
        row.balanceOwed
      );

      if (result?.authorizationUrl) {
        toast.success("Redirecting to payment...");
        // Redirect to Paystack
        window.location.href = result.authorizationUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.message || "Failed to initiate payment";
      toast.error(errorMessage);
    } finally {
      setProcessingDebtorId(null);
    }
  };

  const columns = [
    {
      name: 'Full Name',
      wrap: true,
      selector: (row: DebtorDto) => row.name || "",
      sortable: true,
    },
    {
      name: 'Student ID',
      selector: (row: DebtorDto) => row.studentId || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: (row: DebtorDto) => row.phone || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row: DebtorDto) => row.email || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Room Price',
      selector: (row: DebtorDto) => row.roomPrice ?? 0,
      sortable: true,
    },
    {
      name: 'Amount Paid',
      selector: (row: DebtorDto) => row.amountPaid ?? 0,
      sortable: true,
    },
    {
      name: 'Balance Owed',
      selector: (row: DebtorDto) => row.balanceOwed ?? 0,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: DebtorDto) => (
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-white rounded-md bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={() => handlePayment(row)}
            disabled={processingDebtorId === row.id || !row.balanceOwed || row.balanceOwed <= 0}
          >
            {processingDebtorId === row.id ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay'
            )}
          </button>
        </div>
      ),
    },
  ];


  return (
    <div>
      <CustomDataTable
        title='Deptors List'
        columns={columns}
        data={debtors}
        refetch={refetchDebtors}
        isError={isError}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DebtorListTable;
