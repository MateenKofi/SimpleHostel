import React, { useState, useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Download, Search, FileX, SearchX } from 'lucide-react';
import TableLoader from './loaders/TableLoader';
import CustomeRefetch from './CustomeRefetch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DataTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  onRowClicked?: (row: T) => void;
  serverSide?: boolean;
  totalRows?: number;
  perPage?: number;
  onPageChange?: (page: number, totalRows: number) => void;
  onPerPageChange?: (page: number, totalRows: number) => void;
  exportFilename?: string;
  exportAllData?: T[];
  onSearchChange?: (searchText: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
  showDataCount?: boolean;
}

// Custom styles using CSS variables
const customStyles = {
  table: {
    style: {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
    },
  },
  header: {
    style: {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'hsl(var(--muted))',
      borderBottomColor: 'hsl(var(--border))',
    },
  },
  headCells: {
    style: {
      color: 'hsl(var(--muted-foreground))',
      fontWeight: '600',
      fontSize: '0.875rem',
    },
  },
  rows: {
    style: {
      color: 'hsl(var(--card-foreground))',
      backgroundColor: 'hsl(var(--card))',
      borderBottomColor: 'hsl(var(--border))',
      minHeight: '48px',
      '&:hover': {
        backgroundColor: 'hsl(var(--muted) / 0.5)',
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      borderTopColor: 'hsl(var(--border))',
    },
  },
  paginationInfo: {
    style: {
      color: 'hsl(var(--muted-foreground))',
    },
  },
};

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
  showEmptyState = true,
  emptyStateMessage,
  showDataCount = true,
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
          : (col.selector && (row as Record<string, unknown>)[col.selector as string]);
        if (val == null) return false;
        return String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, columns, searchText, serverSide, searchable]);

  const exportToCSV = () => {
    const rowsForExport = exportAllData ?? data;

    const headers = columns.map(col => col.name).join(',');
    const rows = rowsForExport
      .map(row =>
        columns
          .map(col => {
            const val = typeof col.selector === 'function'
              ? col.selector(row)
              : (col.selector && (row as Record<string, unknown>)[col.selector as string]);
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

  const displayData = serverSide ? data : filteredData;

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <TableLoader />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <CustomeRefetch refetch={refetch} />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0 && showEmptyState) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {title && <CardTitle>{title}</CardTitle>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No data found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {emptyStateMessage || 'No data available at the moment.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No search results state (only for client-side search)
  if (!serverSide && searchable && searchText && filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {title && <CardTitle>{title}</CardTitle>}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchChange}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No results found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search terms
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Data count indicator
  const DataCountIndicator = () => {
    if (!showDataCount) return null;

    const totalCount = totalRows ?? data.length;
    const showingCount = displayData.length;

    return (
      <div className="text-sm text-muted-foreground">
        {serverSide || !searchText
          ? `${totalCount} ${totalCount === 1 ? 'result' : 'results'}`
          : `${showingCount} of ${totalCount} ${totalCount === 1 ? 'result' : 'results'}`
        }
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {title && <CardTitle>{title}</CardTitle>}
            <DataCountIndicator />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {searchable && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="max-w-xs"
                />
              </div>
            )}

            <Button
              onClick={exportToCSV}
              variant="default"
              size="sm"
              className="w-full sm:w-auto gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={columns}
          data={displayData}
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
          customStyles={customStyles}
        />
      </CardContent>
    </Card>
  );
}

export default CustomDataTable;
