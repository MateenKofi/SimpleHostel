import React, { useState } from 'react';
import CustomDataTable from '@/components/CustomDataTable';
import { useQuery } from '@tanstack/react-query';
import { getHostelResidents } from '@/api/residents';
import { ResidentDto } from '@/types/dtos';
import { useAddedResidentStore } from '@/stores/useAddedResidentStore';
import { useNavigate } from 'react-router-dom';

const DebtorListTable: React.FC = () => {
  const navigate = useNavigate()
  const setResidetn = useAddedResidentStore((state) => state.setResident)
  const [selectedDebtor, setSelectedDebtor] = useState<ResidentDto | null>(null);
  const hostelId = localStorage.getItem('hostelId')

  console.log(selectedDebtor)
  const {
    data: ResidentDtoList,
    isLoading,
    isError,
    refetch: refetchResidentDto,
  } = useQuery({
    queryKey: ["resident"],
    queryFn: async () => {
      if (!hostelId) return []
      const responseData = await getHostelResidents(hostelId)
      return responseData?.data
    },
    enabled: !!hostelId,
  });

  const Debtors = ResidentDtoList?.filter((debtor: ResidentDto) =>
    debtor?.room && debtor?.roomPrice !== debtor?.amountPaid
  );
  const handlePayment = (row: ResidentDto) => {
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
      selector: (row: ResidentDto) => row.name || "",
      sortable: true,
    },
    {
      name: 'Student ID',
      selector: (row: ResidentDto) => row.studentId || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: (row: ResidentDto) => row.phone || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row: ResidentDto) => row.email || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Room Price',
      selector: (row: ResidentDto) => row.roomPrice ?? 0,
      sortable: true,
    },
    {
      name: 'Amount Paid',
      selector: (row: ResidentDto) => row.amountPaid ?? 0,
      sortable: true,
    },
    {
      name: 'Balance Owed',
      selector: (row: ResidentDto) => row.balanceOwed ?? 0,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: ResidentDto) => (
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
        title='ResidentDto List'
        columns={columns}
        data={Debtors}
        refetch={refetchResidentDto}
        isError={isError}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DebtorListTable;