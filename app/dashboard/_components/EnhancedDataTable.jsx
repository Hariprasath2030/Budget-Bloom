"use client";
import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
  Trash2,
  Edit3,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV } from "../../../utils/exportUtils";
import dayjs from "dayjs";
import { toast } from "sonner";
import { db } from "../../../utils/dbConfig";
import { Expenses } from "../../../utils/schema";
import { eq } from "drizzle-orm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../@/components/ui/dialog";

function EnhancedDataTable({
  data,
  columns,
  title = "Data Table",
  dateRange = null,
  onDateRangeChange,
  refreshData,
  onDelete,
  enableEditing = false,
  showDateFilter = true,
  showSearch = true,
  showExport = true,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", createdAt: "" });

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!dateRange || (!dateRange[0] && !dateRange[1])) return data;

    return data.filter((item) => {
      if (!item.createdAt) return true;
      
      const itemDate = dayjs(item.createdAt, 'DD/MM/YYYY');
      const startDate = dateRange[0];
      const endDate = dateRange[1];

      if (startDate && endDate) {
        return itemDate.isAfter(startDate.subtract(1, 'day')) && itemDate.isBefore(endDate.add(1, 'day'));
      } else if (startDate) {
        return itemDate.isAfter(startDate.subtract(1, 'day'));
      } else if (endDate) {
        return itemDate.isBefore(endDate.add(1, 'day'));
      }
      return true;
    });
  }, [data, dateRange]);

  const enhancedColumns = useMemo(() => {
    const baseColumns = [...columns];
    
    if (enableEditing) {
      baseColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-300"
            >
              <Edit3 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(row.original)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
        enableSorting: false,
      });
    }
    
    return baseColumns;
  }, [columns, enableEditing, onDelete]);

  const table = useReactTable({
    data: filteredData,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      name: expense.name || "",
      amount: expense.amount || "",
      createdAt: expense.createdAt || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingExpense || !editForm.name || !editForm.amount || !editForm.createdAt) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await db
        .update(Expenses)
        .set({
          name: editForm.name,
          amount: Number(editForm.amount),
          createdAt: editForm.createdAt,
        })
        .where(eq(Expenses.id, editingExpense.id))
        .returning();

      if (result.length > 0) {
        toast.success("Expense updated successfully!");
        setEditingExpense(null);
        setEditForm({ name: "", amount: "", createdAt: "" });
        refreshData && refreshData();
      } else {
        toast.error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  };

  const handleExport = (format) => {
    const exportData = filteredData;
    const exportColumns = columns;

    switch (format) {
      case 'pdf':
        exportToPDF(exportData, exportColumns, title, dateRange);
        break;
      case 'excel':
        exportToExcel(exportData, exportColumns, title, dateRange);
        break;
      case 'csv':
        exportToCSV(exportData, exportColumns, title);
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-3xl shadow-2xl border-2 border-indigo-200 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-200/30 to-indigo-200/30 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
              <BarChart3 className="text-indigo-600 animate-bounce" size={28} />
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <Sparkles className="text-purple-500 animate-spin" size={24} />
          </div>
          
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-cyan-100 px-4 py-2 rounded-2xl border-2 border-indigo-200 shadow-lg">
            <TrendingUp className="text-indigo-600 animate-pulse" size={18} />
            <span className="text-sm font-bold text-indigo-700">
              {filteredData.length} Records
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping delay-100"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {showSearch && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" size={20} />
              <Input
                placeholder="Search records..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 border-2 border-indigo-200 focus:border-purple-500 focus:ring-purple-200 rounded-2xl h-12 bg-gradient-to-r from-white to-indigo-50/30 shadow-lg"
              />
            </div>
          )}
          
          {showExport && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport('pdf')}
                variant="outline"
                size="sm"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                variant="outline"
                size="sm"
                className="border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <FileSpreadsheet size={16} className="mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                size="sm"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <Download size={16} className="mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl border-2 border-indigo-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-600 text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-4 text-left font-bold text-sm sm:text-base cursor-pointer hover:bg-white/10 transition-colors duration-300"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <span className="text-white/80">
                              {header.column.getIsSorted() === "desc" ? "↓" : "↑"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 ${
                        index % 2 === 0 ? "bg-white/50" : "bg-indigo-50/30"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-4 text-sm sm:text-base">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={enhancedColumns.length}
                      className="h-24 text-center text-gray-500 font-medium"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Star className="text-indigo-400 animate-pulse" size={32} />
                        <span>No results found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-600 font-medium">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-2 border-indigo-200 hover:bg-indigo-50 rounded-xl px-4 py-2 transition-all duration-300"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl font-bold text-indigo-700 border-2 border-indigo-200">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-2 border-indigo-200 hover:bg-indigo-50 rounded-xl px-4 py-2 transition-all duration-300"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border-2 border-indigo-200 shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
              <Edit3 className="text-indigo-600 animate-bounce" size={24} />
              Edit Expense
              <Zap className="text-purple-600 animate-pulse" size={24} />
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-2">
                    Expense Name
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="border-2 border-indigo-200 focus:border-purple-500 rounded-2xl h-12 bg-gradient-to-r from-white to-indigo-50/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-2">
                    Amount
                  </label>
                  <Input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="border-2 border-purple-200 focus:border-cyan-500 rounded-2xl h-12 bg-gradient-to-r from-white to-purple-50/30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-cyan-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Date
                  </label>
                  <Input
                    type="date"
                    value={editForm.createdAt ? dayjs(editForm.createdAt, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''}
                    onChange={(e) => {
                      const formattedDate = dayjs(e.target.value).format('DD/MM/YYYY');
                      setEditForm({ ...editForm, createdAt: formattedDate });
                    }}
                    className="border-2 border-cyan-200 focus:border-indigo-500 rounded-2xl h-12 bg-gradient-to-r from-white to-cyan-50/30"
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setEditingExpense(null)}
              className="border-2 border-gray-200 hover:bg-gray-50 rounded-2xl px-6 py-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-600 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-700 text-white rounded-2xl px-6 py-3 shadow-xl"
            >
              <Star className="mr-2 animate-pulse" size={16} />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnhancedDataTable;