"use client";
import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  Search, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Edit3, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown,
  Filter,
  Calendar,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { exportToPDF, exportToExcel, exportToCSV } from '../../../utils/exportUtils';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { db } from '../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { Expenses } from '../../../utils/schema';

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className="h-8 text-sm"
          autoFocus
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={onBlur}
          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
        >
          <Check size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setValue(initialValue);
            setIsEditing(false);
          }}
          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1 rounded"
      onClick={() => setIsEditing(true)}
    >
      <span className="flex-1">{value}</span>
      <Edit3 
        size={14} 
        className="opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" 
      />
    </div>
  );
};

function EnhancedDataTable({ 
  data, 
  columns, 
  title = "Data Table",
  dateRange,
  onDateRangeChange,
  refreshData,
  showDateFilter = true,
  showExport = true,
  showSearch = true,
  enableEditing = true,
  onDelete
}) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  // Enhanced columns with editing capability
  const enhancedColumns = useMemo(() => {
    const baseColumns = [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns.map(col => ({
        ...col,
        cell: enableEditing && (col.accessorKey === 'name' || col.accessorKey === 'amount') 
          ? EditableCell 
          : col.cell || (({ getValue }) => getValue()),
      })),
    ];

    if (onDelete) {
      baseColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        ),
        enableSorting: false,
      });
    }

    return baseColumns;
  }, [columns, enableEditing, onDelete]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnFilters,
    },
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        const row = data[rowIndex];
        if (!row) return;

        try {
          const result = await db.update(Expenses)
            .set({ [columnId]: value })
            .where(eq(Expenses.id, row.id))
            .returning();

          if (result.length > 0) {
            toast.success(`${columnId} updated successfully`);
            refreshData && refreshData();
          } else {
            toast.error('Failed to update');
          }
        } catch (error) {
          console.error('Error updating:', error);
          toast.error('Failed to update');
        }
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedData = selectedRows.map(row => row.original);

  const handleExport = (format) => {
    const dataToExport = selectedData.length > 0 ? selectedData : data;
    const exportColumns = columns;

    switch (format) {
      case 'pdf':
        exportToPDF(dataToExport, exportColumns, title, dateRange);
        break;
      case 'excel':
        exportToExcel(dataToExport, exportColumns, title, dateRange);
        break;
      case 'csv':
        exportToCSV(dataToExport, exportColumns, title);
        break;
    }

    toast.success(`${format.toUpperCase()} exported successfully!`);
  };

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return data;
    }

    const startDate = dayjs(dateRange[0]);
    const endDate = dayjs(dateRange[1]);

    return data.filter(item => {
      const itemDate = dayjs(item.createdAt, 'DD/MM/YYYY');
      return itemDate.isAfter(startDate.subtract(1, 'day')) && 
             itemDate.isBefore(endDate.add(1, 'day'));
    });
  }, [data, dateRange]);

  useEffect(() => {
    table.setData(filteredData);
  }, [filteredData, table]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-blue-100 mt-1">
              {selectedData.length > 0 
                ? `${selectedData.length} of ${data.length} rows selected`
                : `${data.length} total records`
              }
            </p>
          </div>
          
          {showExport && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleExport('pdf')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                size="sm"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                size="sm"
              >
                <FileSpreadsheet size={16} className="mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport('csv')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                size="sm"
              >
                <File size={16} className="mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {showSearch && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search across all columns..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          )}
          
          {showDateFilter && onDateRangeChange && (
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400" size={20} />
              <span className="text-sm text-gray-600 whitespace-nowrap">Date Range Filter</span>
            </div>
          )}
        </div>

        {selectedData.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">
                {selectedData.length} rows selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRowSelection({})}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleExport('pdf')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download size={14} className="mr-1" />
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())
                        }
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp 
                              size={12} 
                              className={`${
                                header.column.getIsSorted() === 'asc' 
                                  ? 'text-blue-600' 
                                  : 'text-gray-400'
                              }`} 
                            />
                            <ChevronDown 
                              size={12} 
                              className={`${
                                header.column.getIsSorted() === 'desc' 
                                  ? 'text-blue-600' 
                                  : 'text-gray-400'
                              } -mt-1`} 
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row, index) => (
                <tr 
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    row.getIsSelected() ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                  .filter(page => {
                    const current = table.getState().pagination.pageIndex + 1;
                    return page === 1 || page === table.getPageCount() || 
                           (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className="px-2 text-gray-400">...</span>
                          <Button
                            variant={table.getState().pagination.pageIndex + 1 === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => table.setPageIndex(page - 1)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={table.getState().pagination.pageIndex + 1 === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => table.setPageIndex(page - 1)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDataTable;