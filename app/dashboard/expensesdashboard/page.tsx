"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { ReceiptText, ArrowLeft } from 'lucide-react';
import { Budgets, Expenses } from "../../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../../utils/dbConfig";
import DashboardHeader from '../../dashboard/_components/DashboardHeader';
import SideNav from '../_components/SideNav';
import EnhancedDataTable from '../_components/EnhancedDataTable';
import DateRangeFilter from '../_components/DateRangeFilter';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { motion } from "framer-motion";

function ExpensesDashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    if (user) getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    getAllExpenses();
  };

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteExpense = async (expense) => {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;
    try {
      const result = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();
      if (result.length > 0) {
        toast.success("Deleted");
        getBudgetList();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const expenseColumns = [
    { accessorKey: 'name', header: 'Name', cell: ({ getValue }) => <div className="font-semibold text-gray-900 text-sm">{getValue()}</div> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ getValue }) => <div className="font-bold text-emerald-600">${getValue()}</div> },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ getValue }) => {
      const v = getValue();
      if (!v) return <span className="text-gray-400">—</span>;
      let f = v;
      if (typeof v === 'string' && !v.includes('/')) {
        const p = dayjs(v);
        if (p.isValid()) f = p.format('DD/MM/YYYY');
      }
      return <span className="text-gray-500 text-sm font-medium">{f}</span>;
    }},
  ];

  return (
    <>
      <div className="sticky top-0 z-40">
        <DashboardHeader onLogoClick={() => {}} />
      </div>

      <div className="flex">
        <div className="hidden lg:block">
          <SideNav />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50/50 pb-nav">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white overflow-hidden relative shadow-xl shadow-rose-500/20"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => router.back()}
                  className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft size={18} />
                </motion.button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ReceiptText size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl sm:text-3xl">All Expenses</h2>
                    <p className="text-rose-100 text-sm mt-0.5 font-medium">View and manage all transactions</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <EnhancedDataTable
              data={expensesList}
              columns={expenseColumns}
              title="Expense List"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              refreshData={getBudgetList}
              onDelete={deleteExpense}
              enableEditing={true}
              showDateFilter={false}
            />
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <SideNav />
      </div>
    </>
  );
}

export default ExpensesDashboard;
