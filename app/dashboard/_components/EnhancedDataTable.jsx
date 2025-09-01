"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
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
  Plus,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../@/components/ui/input";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
} from "../../../utils/exportUtils";
import dayjs from "dayjs";
import { toast } from "sonner";
import { db } from "../../../utils/dbConfig";
import { eq } from "drizzle-orm";
import { Expenses } from "../../../utils/schema";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onBlur();
    } else if (e.key === "Escape") {
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
        {column.id === 'createdAt' ? (
          <Input
            type="date"
            value={value ? dayjs(value, "DD/MM/YYYY").format('YYYY-MM-DD') : ''}
            onChange={(e) => setValue(dayjs(e.target.value).format('DD/MM/YYYY'))}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="h-8 text-sm"
            autoFocus
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="h-8 text-sm"
            autoFocus
          />
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={onBlur}
          className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
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
          className="h-6 w-6 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between group cursor-pointer hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 p-2 rounded-lg transition-all duration-200"
      onClick={() => setIsEditing(true)}
    >
      <span className="flex-1 font-medium">{value}</span>
      <Edit3
        size={14}
        className="opacity-0 group-hover:opacity-100 text-violet-400 transition-all duration-200"
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
  onDelete,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const enhancedColumns = useMemo(() => {
    const baseColumns = [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="rounded border-violet-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="rounded border-violet-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns.map((col) => ({
        ...col,
        cell:
          enableEditing &&
          (col.accessorKey === "name" || col.accessorKey === "amount" || col.accessorKey === "createdAt")
            ? EditableCell
            : col.cell || (({ getValue }) => getValue()),
      })),
    ];

    if (onDelete) {
      baseColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-all duration-200"
          >
            <Trash2 size={14} />
          </Button>
        ),
        enableSorting: false,
      });
    }

    return baseColumns;
  }, [columns, enableEditing, onDelete]);

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return data;
    }

    try {
      const startDate = dayjs(dateRange[0]).startOf('day');
      const endDate = dayjs(dateRange[1]).endOf('day');

      if (!startDate.isValid() || !endDate.isValid()) {
        console.warn('Invalid date range provided');
        return data;
      }

      return data.filter((item) => {
        if (!item.createdAt) return false;
        
        try {
          // Handle different date formats more robustly
          let itemDate;
          
          // First try DD/MM/YYYY format
          if (typeof item.createdAt === 'string' && item.createdAt.includes('/')) {
            itemDate = dayjs(item.createdAt, "DD/MM/YYYY", true);
          } else {
            // Try ISO date format or other standard formats
            itemDate = dayjs(item.createdAt);
          }
          
          // If still invalid, try other common formats
          if (!itemDate.isValid()) {
            const formats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD'];
            for (const format of formats) {
              itemDate = dayjs(item.createdAt, format, true);
              if (itemDate.isValid()) break;
            }
          }
          
          if (!itemDate.isValid()) {
            console.warn('Invalid date format:', item.createdAt);
            return false;
          }
          
          return itemDate.isBetween(startDate, endDate, null, '[]');
        } catch (error) {
          console.error('Error parsing date:', item.createdAt, error);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in date filtering:', error);
      return data;
    }
  }, [data, dateRange]);

  const table = useReactTable({
    data: filteredData,
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
        const row = filteredData[rowIndex];
        if (!row) return;

        try {
          const updateData = { [columnId]: value };
          
          const result = await db
            .update(Expenses)
            .set(updateData)
            .where(eq(Expenses.id, row.id))
            .returning();

          if (result.length > 0) {
            toast.success(`${columnId === 'createdAt' ? 'Date' : columnId} updated successfully`);
            refreshData && refreshData();
          } else {
            toast.error("Failed to update");
          }
        } catch (error) {
          console.error("Error updating:", error);
          toast.error("Failed to update");
        }
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);

  const handleExport = (format) => {
    const dataToExport = selectedData.length > 0 ? selectedData : data;
    const exportColumns = columns;

    switch (format) {
      case "pdf":
        exportToPDF(dataToExport, exportColumns, title, dateRange);
        break;
      case "excel":
        exportToExcel(dataToExport, exportColumns, title, dateRange);
        break;
      case "csv":
        exportToCSV(dataToExport, exportColumns, title);
        break;
    }

    toast.success(`${format.toUpperCase()} exported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            <h2 className="text-2xl lg:text-3xl font-bold relative z-10">{title}</h2>
            <p className="text-violet-100 mt-2 text-sm lg:text-base">
              {selectedData.length > 0
                ? `${selectedData.length} of ${data.length} rows selected`
                : `${data.length} total records`}
            </p>
          </div>

          {showExport && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleExport("pdf")}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                size="sm"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExport("excel")}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                size="sm"
              >
                <FileSpreadsheet size={16} className="mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport("csv")}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {showSearch && (
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400"
                  size={20}
                />
                <Input
                  placeholder="Search across all columns..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 h-12 border-violet-200 focus:border-violet-400 focus:ring-violet-400 rounded-xl"
                />
              </div>
            </div>
          )}

          {showDateFilter && onDateRangeChange && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2 rounded-xl">
              <Calendar className="text-violet-500" size={20} />
              <span className="text-sm text-violet-700 whitespace-nowrap font-medium">
                Set Date Range
              </span>
            </div>
          )}
        </div>

        {selectedData.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm text-violet-700 font-medium">
                {selectedData.length} rows selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRowSelection({})}
                  className="text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  <Download size={14} className="mr-1" />
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 border-b border-violet-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 lg:px-6 py-4 text-left text-sm font-bold text-violet-800 cursor-pointer hover:bg-violet-200 transition-all duration-200"
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp
                              size={12}
                              className={`${
                                header.column.getIsSorted() === "asc"
                                  ? "text-violet-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronDown
                              size={12}
                              className={`${
                                header.column.getIsSorted() === "desc"
                                  ? "text-violet-600"
                                  : "text-gray-400"
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
            <tbody className="divide-y divide-violet-100">
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-all duration-200 ${
                    row.getIsSelected()
                      ? "bg-gradient-to-r from-violet-100 to-purple-100"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/50"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 lg:px-6 py-4 text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 lg:px-6 py-4 border-t border-violet-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-violet-700">
              <span>Show</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-violet-300 rounded-lg px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-violet-400"
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
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = table.getState().pagination.pageIndex + 1;
                    return (
                      page === 1 ||
                      page === table.getPageCount() ||
                      (page >= current - 1 && page <= current + 1)
                    );
                  })
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className="px-2 text-violet-400">...</span>
                          <Button
                            variant={
                              table.getState().pagination.pageIndex + 1 === page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => table.setPageIndex(page - 1)}
                            className={`w-8 h-8 p-0 ${
                              table.getState().pagination.pageIndex + 1 === page
                                ? "bg-gradient-to-r from-violet-600 to-purple-600"
                                : "border-violet-200 text-violet-600 hover:bg-violet-50"
                            }`}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={
                          table.getState().pagination.pageIndex + 1 === page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => table.setPageIndex(page - 1)}
                        className={`w-8 h-8 p-0 ${
                          table.getState().pagination.pageIndex + 1 === page
                            ? "bg-gradient-to-r from-violet-600 to-purple-600"
                            : "border-violet-200 text-violet-600 hover:bg-violet-50"
                        }`}
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
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                Next
              </Button>
            </div>

            <div className="text-sm text-violet-700 font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDataTable;