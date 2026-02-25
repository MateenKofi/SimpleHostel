import React, { useState } from 'react';
import CustomDataTable from '@/components/CustomDataTable';
import { useQuery } from '@tanstack/react-query';
import { getDebtorsPaginated } from '@/api/residents';
import { DebtorDto } from '@/types/dtos';
import { useAddedResidentStore } from '@/stores/useAddedResidentStore';
import { useNavigate } from 'react-router-dom';

const DebtorListTable: React.FC = () => {
  const navigate = useNavigate()
  const setResidetn = useAddedResidentStore((state) => state.setResident)
  const [selectedDebtor, setSelectedDebtor] = useState<DebtorDto | null>(null);
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

  const handlePayment = (row: DebtorDto) => {
    setResidetn(row)
    setSelectedDebtor(row)
    setTimeout(() => {
      navigate('/dashboard/top-up')
    }, 50)
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
          <button className="px-4 py-2 text-white rounded-md bg-primary"
            onClick={() => handlePayment(row)}
          >
            Pay
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
