"use client";
import React, { useEffect, useState } from 'react';
import { Trash, ArrowLeft } from 'lucide-react';
import DashboardHeader from '../../../dashboard/_components/DashboardHeader';
import SideNav from '../../../dashboard/_components/SideNav';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '../../../../utils/schema';
import { db } from '../../../../utils/dbConfig';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import EnhancedDataTable from '../../_components/EnhancedDataTable';
import DateRangeFilter from '../../_components/DateRangeFilter';
import { Button } from '../../../../components/ui/button';
import EditBudget from './_components/EditBudget';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../@/components/ui/alert-dialog";
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export default function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const route = useRouter();

  useEffect(() => {
    if (user) getBudgetInfo();
  }, [user, params]);

  const getBudgetInfo = async () => {
    if (!params?.id) return;
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(and(
        eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
        eq(Budgets.id, params.id)
      ))
      .groupBy(...Object.values(getTableColumns(Budgets)));

    setBudgetInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteBudget = async () => {
    await db.delete(Expenses).where(eq(Expenses.budgetId, params.id)).returning();
    await db.delete(Budgets).where(eq(Budgets.id, params.id)).returning();
    toast.success("Budget deleted");
    route.replace('/dashboard/budgets');
  };

  const deleteExpense = async (expense) => {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;
    try {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();
      if (result.length > 0) {
        toast.success("Deleted");
        getBudgetInfo();
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
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-5 sm:p-7 text-white overflow-hidden relative shadow-xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => route.back()}
                    className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                  <div>
                    <h2 className="font-black text-xl sm:text-2xl">Budget Expenses</h2>
                    <p className="text-blue-100 text-xs sm:text-sm mt-0.5 font-medium">Manage and track spending</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-shrink-0">
                  <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="rounded-2xl bg-red-500/80 hover:bg-red-600 border-0 backdrop-blur-sm gap-1.5">
                        <Trash size={14} />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-0 shadow-2xl">
                      <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle className="text-red-600 font-black text-xl">Delete budget?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          This will permanently delete this budget and all its expenses. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex justify-end gap-2">
                        <AlertDialogCancel className="rounded-2xl font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteBudget} className="bg-red-600 hover:bg-red-700 rounded-2xl font-bold">
                          Delete Budget
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </motion.div>

            {/* Budget item + Add expense */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {budgetInfo ? (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <BudgetItem budget={budgetInfo} />
                </motion.div>
              ) : (
                <div className="skeleton h-40 rounded-3xl" />
              )}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
              </motion.div>
            </div>

            {/* Expenses table */}
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <EnhancedDataTable
              data={expensesList}
              columns={expenseColumns}
              title="Expenses"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              refreshData={getBudgetInfo}
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
