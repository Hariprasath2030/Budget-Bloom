"use client";
import React, { useState, useMemo } from 'react';
import { Trash } from 'lucide-react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { db } from '../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { Expenses } from '../../../utils/schema';
import dayjs from 'dayjs';

function PaginatedTable({ expensesList, refreshData, dateRange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return expensesList;
    }

    const startDate = dayjs(dateRange[0]);
    const endDate = dayjs(dateRange[1]);

    return expensesList.filter(expense => {
      const expenseDate = dayjs(expense.createdAt, 'DD/MM/YYYY');
      return expenseDate.isAfter(startDate.subtract(1, 'day')) && 
             expenseDate.isBefore(endDate.add(1, 'day'));
    });
  }, [expensesList, dateRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const deleteExpense = async (expense) => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result.length > 0) {
        toast.success("Expense deleted successfully");
        refreshData();
        
        // Adjust current page if needed
        const newTotalPages = Math.ceil((filteredExpenses.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  if (filteredExpenses.length === 0) {
    return (
      <div className="mt-6 p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="text-gray-500 text-lg">
          {expensesList.length === 0 ? "No expenses found" : "No expenses found for the selected date range"}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
        <h1 className="font-bold text-2xl text-white">Latest Expenses</h1>
        <p className="text-indigo-100 text-sm mt-1">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} expenses
        </p>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-4 bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 gap-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Name</h2>
        <h2 className="font-semibold text-gray-700">Amount</h2>
        <h2 className="font-semibold text-gray-700">Date</h2>
        <h2 className="font-semibold text-gray-700">Actions</h2>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {paginatedExpenses.map((expense, index) => (
          <div
            key={expense.id}
            className={`grid grid-cols-1 md:grid-cols-4 px-6 py-4 gap-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Expense Name</p>
                  <h2 className="font-bold text-gray-900 text-lg">{expense.name}</h2>
                </div>
                <Trash
                  className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                  size={32}
                  onClick={() => deleteExpense(expense)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Amount</p>
                  <h2 className="font-bold text-green-600 text-lg">${expense.amount}</h2>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <h2 className="font-bold text-gray-700">{expense.createdAt}</h2>
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <h2 className="hidden md:block font-semibold text-gray-900 self-center">{expense.name}</h2>
            <h2 className="hidden md:block font-bold text-green-600 text-lg self-center">${expense.amount}</h2>
            <h2 className="hidden md:block font-medium text-gray-700 self-center">{expense.createdAt}</h2>
            <div className="hidden md:flex justify-start items-center">
              <Trash
                className="text-red-500 hover:text-red-700 cursor-pointer transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                size={20}
                onClick={() => deleteExpense(expense)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  },
                },
              }}
            />
          </Stack>
        </div>
      )}
    </div>
  );
}

export default PaginatedTable;