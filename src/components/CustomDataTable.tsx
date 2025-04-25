import React, { useState, useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Download, RefreshCcw, Search } from 'lucide-react';
import TableLoader from './loaders/TableLoader';

interface DataTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];                        // full dataset
  searchable?: boolean;
  onRowClicked?: (row: T) => void;
  serverSide?: boolean;             // if true, data might be paginated
  totalRows?: number;
  perPage?: number;
  onPageChange?: (page: number, totalRows: number) => void;
  onPerPageChange?: (page: number, totalRows: number) => void;
  exportFilename?: string;
  exportAllData?: T[];              // optional full data override (for server-side)
  onSearchChange?: (searchText: string) => void; // new prop for server-side search
  isLoading?:boolean;
  isError?:boolean;
  refetch?:()=>void;
}

function CustomDataTable<T>({
  title,
  columns,
  data,
  searchable = true,
  onRowClicked,
  serverSide = false,
  totalRows,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  exportFilename = title ? `${title}.csv` : 'export.csv',
  exportAllData,
  onSearchChange,
  isLoading,
  isError,
  refetch,
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (serverSide && onSearchChange) {
      onSearchChange(value);
    }
  };

  // For client-side search, filter data locally
  const filteredData = useMemo(() => {
    if (serverSide || !searchable || !searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = typeof col.selector === 'function'
          ? col.selector(row)
          : (col.selector && (row as any)[col.selector as string]);
        if (val == null) return false;
        return String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, columns, searchText, serverSide, searchable]);

  const exportToCSV = () => {
    // Use full data if provided, otherwise fallback to data prop
    const rowsForExport = exportAllData ?? data;

    const headers = columns.map(col => col.name).join(',');
    const rows = rowsForExport
      .map(row =>
        columns
          .map(col => {
            // selector can be string key or function
            const val = typeof col.selector === 'function'
              ? col.selector(row)
              : (col.selector && (row as any)[col.selector as string]);
            // wrap commas/newlines in quotes
            return JSON.stringify(val ?? '');
          })
          .join(',')
      )
      .join('\n');

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if(isLoading){
    return <TableLoader/>
  }
  
  if(isError){
    return <div className='w-full h-[70dvh] grid place-items-center text-red-500'>
      <div className=' flex flex-col items-center'>
        <h2 className='text-xl font-serif italic'>Error loading data</h2>
        <p className='text-xs'>Try reloading data</p>
      <button className='btn btn-sm btn-black mt-4' onClick={refetch}>
        <RefreshCcw/>
        Try Again
        </button>
      </div>
    </div>
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div className="flex flex-wrap items-center gap-4 justify-between">
        {searchable && (
          <div className="flex items-center gap-2">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              className="input input-bordered input-sm"
            />
          </div>
        )}

        <button
          onClick={exportToCSV}
          className="btn btn-sm btn-outline flex items-center gap-1"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={serverSide ? data : filteredData}
        pagination
        paginationServer={serverSide}
        paginationTotalRows={totalRows}
        paginationPerPage={perPage}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onPerPageChange}
        responsive
        highlightOnHover
        pointerOnHover={!!onRowClicked}
        onRowClicked={onRowClicked}
        persistTableHead
      />
    </div>
  );
}

export default CustomDataTable;
