import React, { useState } from 'react';
import CustomDataTable from '@/components/CustomDataTable';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Deptors } from '@/helper/types/types';
import { useAddedResidentStore } from '@/controllers/AddedResident';
import { useNavigate } from 'react-router-dom';

const DebtorListTable: React.FC = () => {
  const navigate = useNavigate()
  const setResidetn = useAddedResidentStore((state) => state.setResident)
  const [selectedDebtor, setSelectedDebtor] = useState<Deptors | null>(null);
  const hostelId = localStorage.getItem('hostelId')

  console.log(selectedDebtor)
  const {
    data: DeptorsList,
    isLoading,
    isError,
    refetch: refetchDeptors,
  } = useQuery({
    queryKey: ["resident"],
    queryFn: async () => {
      const response = await axios.get(`/api/residents/hostel/${hostelId}`);
      return response?.data?.data;
    },
    enabled: !!hostelId,
  });

  const Debtors = DeptorsList?.filter((debtor: Deptors) =>
    debtor?.room && debtor?.roomPrice !== debtor?.amountPaid
  );
  const handlePayment = (row: Deptors) => {
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
      selector: (row: Deptors) => row.name || "",
      sortable: true,
    },
    {
      name: 'Student ID',
      selector: (row: Deptors) => row.studentId || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: (row: Deptors) => row.phone || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row: Deptors) => row.email || "",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Room Price',
      selector: (row: Deptors) => row.roomPrice ?? 0,
      sortable: true,
    },
    {
      name: 'Amount Paid',
      selector: (row: Deptors) => row.amountPaid ?? 0,
      sortable: true,
    },
    {
      name: 'Balance Owed',
      selector: (row: Deptors) => row.balanceOwed ?? 0,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: Deptors) => (
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
        data={Debtors}
        refetch={refetchDeptors}
        isError={isError}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DebtorListTable;