import React, { useEffect, useState } from 'react';
import CustomDataTable from '@components/CustomDataTable';
import { TableColumn } from 'react-data-table-component';

type Transaction = {
    id: number;
    user: string;
    amount: number;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
};


const columns: TableColumn<Transaction>[] = [
    { name: 'ID', selector: (row) => row.id.toString(), sortable: true },
    { name: 'User', selector: (row) => row.user, sortable: true },
    { name: 'Amount', selector: (row) => `$${row.amount}`, sortable: true },
    { name: 'Date', selector: (row) => row.date, sortable: true },
    { name: 'Status', selector: (row) => row.status, sortable: true },
];

const Transactions = () => {
 
const [data, setData] = useState<Transaction[]>([]);

useEffect(() => {
    // Simulate fetch
    const fetchData = () => {
        const all = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            user: `User ${i + 1}`,
            amount: Math.floor(Math.random() * 1000) + 100,
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
            status: (i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'Failed') as Transaction['status'],
        }));
        setData(all);
    };
    fetchData();
}, []);




  return (
    <div className="p-6">
      <CustomDataTable<Transaction>
        title="User Management"
        data={data}
        columns={columns}
      />
    </div>
  );
};

export default Transactions;
