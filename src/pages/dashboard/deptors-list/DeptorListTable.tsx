import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useModal } from '@/components/Modal';
import DeptorPayment from './DeptorPayment';

const DebtorListTable: React.FC = () => {
  const { open: openDeptorsListPaymentModal, close: closeDeptorsListPamentModal } = useModal('deptor_payment_modal');
  const [selectedDebtor, setSelectedDebtor] = useState<any>(null);

  const handlePayment = (row: any) => {
    // Handle payment logic here
    openDeptorsListPaymentModal();
    setSelectedDebtor(row)
  };

  const columns = [
    {
      name: 'Full Name',
      selector: (row: any) => row.fullName,
      sortable: true,
    },
    {
      name: 'Student ID',
      selector: (row: any) => row.studentId,
      sortable: true,
    },
    {
      name: 'Phone',
      selector: (row: any) => row.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: 'Original Amount',
      selector: (row: any) => row.originalAmount,
      sortable: true,
    },
    {
      name: 'Partial Payment',
      selector: (row: any) => row.partialPayment,
      sortable: true,
    },
    {
      name: 'Amount Owed',
      selector: (row: any) => row.originalAmount - row.partialPayment,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => handlePayment(row)}
          >
            Pay
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      fullName: 'John Doe',
      studentId: 'S12345',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      originalAmount: 1000,
      partialPayment: 200,
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      studentId: 'S67890',
      phone: '098-765-4321',
      email: 'jane.smith@example.com',
      originalAmount: 1500,
      partialPayment: 500,
    },
    // Add more dummy data as needed
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination
      />
      <DeptorPayment debtor={selectedDebtor} onClose={closeDeptorsListPamentModal} />
    </div>
  );
};

export default DebtorListTable;