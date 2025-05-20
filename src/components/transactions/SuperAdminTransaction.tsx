// import React from 'react'
// import CustomDataTable from '@components/CustomDataTable'
// import axios from 'axios'
// import { useQuery } from '@tanstack/react-query'

// const SuperAdminTransaction = () => {
//   const { data: transactionData, isLoading,isError,refetch:refetchTransactions } = useQuery({
//     queryKey: ['transactions'],
//     queryFn: async () => {
//       const response = await axios.get('/api/transactions/get/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       })
//       return response.data?.data
//     },
//   })
//   return (
//     <div>
//         <CustomDataTable data={transactionData} />
//     </div>
//   )
// }

// export default SuperAdminTransaction