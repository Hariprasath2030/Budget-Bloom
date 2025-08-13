"use client";
import React, { useMemo } from 'react';
import { db } from '../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { Expenses } from '../../../utils/schema';
import EnhancedDataTable from './EnhancedDataTable';

function PaginatedTable({ expensesList, refreshData, dateRange }) {
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
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Expense Name',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue()}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ getValue }) => (
        <div className="font-bold text-green-600 text-lg">${getValue()}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-700">{getValue()}</div>
      ),
    },
  ], []);

  return (
    <EnhancedDataTable
      data={expensesList}
      columns={columns}
      title="Latest Expenses"
      dateRange={dateRange}
      refreshData={refreshData}
      onDelete={deleteExpense}
      enableEditing={true}
      showDateFilter={false}
    />
  );
}

export default PaginatedTable;