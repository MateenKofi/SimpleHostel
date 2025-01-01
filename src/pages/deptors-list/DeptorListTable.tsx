import React, { useState } from 'react';
import { useResidentStore } from '../../stores/residentStore';
import DataTable from 'react-data-table-component';
import { useModal } from '@/components/Modal';
import DeptorPayment from './DeptorPayment';

const DebtorListTable: React.FC = () => {
  const { open: openDeptorsListPaymentModal, close: closeDeptorsListPamentModal } = useModal('deptor_payment_modal');
  const debtorsList = useResidentStore((state) => state.debtorsList);
  const residents = useResidentStore((state) => state.residents);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  // Combine debtors list with resident information
  const combinedList = debtorsList.map((debtor) => {
    const resident = residents.find((res) => res.id === debtor.residentId);
    return {
      ...debtor,
      fullName: resident?.fullName || 'N/A',
      studentId: resident?.studentId || 'N/A',
      phone: resident?.phone || 'N/A',
      email: resident?.email || 'N/A',
    };
  });

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

  const handlePayment = (row) => {
    setSelectedDebtor(row);
    openDeptorsListPaymentModal();
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={combinedList}
        pagination
      />
      <DeptorPayment debtor={selectedDebtor} onClose={closeDeptorsListPamentModal} />
    </div>
  );
};

export default DebtorListTable;