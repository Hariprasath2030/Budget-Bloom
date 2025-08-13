"use client";
import React, { useMemo } from 'react';
import { toast } from 'sonner';
import { db } from '../../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { Budgets } from '../../../../utils/schema';
import EnhancedDataTable from '../../_components/EnhancedDataTable';

function BudgetDataTable({ budgetList, refreshData }) {
  const deleteBudget = async (budget) => {
    const confirmDelete = confirm("Are you sure you want to delete this budget? This will also delete all associated expenses.");
    if (!confirmDelete) return;

    try {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, budget.id))
        .returning();

      if (result.length > 0) {
        toast.success("Budget deleted successfully");
        refreshData();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'icon',
      header: 'Icon',
      cell: ({ getValue }) => (
        <div className="text-2xl">{getValue()}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: 'Budget Name',
      cell: ({ getValue }) => (
        <div className="font-semibold text-gray-900">{getValue()}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Budget Amount',
      cell: ({ getValue }) => (
        <div className="font-bold text-blue-600 text-lg">${getValue()}</div>
      ),
    },
    {
      accessorKey: 'totalSpend',
      header: 'Total Spent',
      cell: ({ getValue }) => (
        <div className="font-bold text-red-600 text-lg">${getValue() || 0}</div>
      ),
    },
    {
      accessorKey: 'totalItem',
      header: 'Total Items',
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-700">{getValue() || 0}</div>
      ),
    },
    {
      id: 'remaining',
      header: 'Remaining',
      cell: ({ row }) => {
        const remaining = (row.original.amount || 0) - (row.original.totalSpend || 0);
        return (
          <div className={`font-bold text-lg ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${remaining.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: 'progress',
      header: 'Progress',
      cell: ({ row }) => {
        const percentage = row.original.amount > 0 
          ? Math.min(((row.original.totalSpend || 0) / row.original.amount) * 100, 100)
          : 0;
        
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
      enableSorting: false,
    },
  ], []);

  return (
    <EnhancedDataTable
      data={budgetList}
      columns={columns}
      title="Budget Overview"
      onDelete={deleteBudget}
      enableEditing={true}
      showDateFilter={false}
      showSearch={true}
      showExport={true}
      refreshData={refreshData}
    />
  );
}

export default BudgetDataTable;