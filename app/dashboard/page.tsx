"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from '../dashboard/_components/DashboardHeader';
import SideNav from '../dashboard/_components/SideNav';
import { useUser } from "@clerk/nextjs";
import CardInfo from '../dashboard/_components/CardInfo';
import { Budgets, Expenses } from "../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../utils/dbConfig";
import BarChartDashboard from '../dashboard/_components/BarChartDashboard';
import BudgetItem from "./budgets/_components/BudgetItem";
import EnhancedDataTable from './_components/EnhancedDataTable';
import DateRangeFilter from './_components/DateRangeFilter';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteExpense = async (expense) => {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;
    try {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();
      if (result.length > 0) {
        toast.success("Expense deleted");
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
      if (!v) return <span className="text-gray-400 text-sm">—</span>;
      let formatted = v;
      if (typeof v === 'string' && !v.includes('/')) {
        const p = dayjs(v);
        if (p.isValid()) formatted = p.format('DD/MM/YYYY');
      }
      return <span className="text-gray-500 text-sm font-medium">{formatted}</span>;
    }},
  ];

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-40">
        <DashboardHeader onLogoClick={() => {}} />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <SideNav />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50/50 pb-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

            {/* Welcome card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
              <div className="absolute top-4 right-6 opacity-30">
                <Sparkles size={60} />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-semibold mb-1">Welcome back</p>
                <h2 className="font-black text-2xl sm:text-4xl mb-2">
                  Hi, {user?.firstName || "Friend"} 👋
                </h2>
                <p className="text-blue-100 text-sm sm:text-base font-medium">
                  Here's your financial snapshot
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-200 font-medium">Live data</span>
                </div>
              </div>
            </motion.div>

            {/* Card Info */}
            <CardInfo budgetList={budgetList} />

            {/* Charts + Budget sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <BarChartDashboard budgetList={budgetList} />
                <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
                <EnhancedDataTable
                  data={expensesList}
                  columns={expenseColumns}
                  title="Recent Expenses"
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  refreshData={getBudgetList}
                  onDelete={deleteExpense}
                  enableEditing={true}
                  showDateFilter={false}
                />
              </div>

              {/* Budget list sidebar */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                      <h2 className="font-black text-gray-900 text-lg">Latest Budgets</h2>
                    </div>
                    <Link href="/dashboard/budgets">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        View all
                        <ArrowRight size={12} />
                      </motion.button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {budgetList.length > 0 ? (
                      budgetList.slice(0, 4).map((budget, i) => (
                        <motion.div
                          key={budget.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <BudgetItem budget={budget} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton h-24 rounded-2xl" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden">
        <SideNav />
      </div>
    </>
  );
}

export default Dashboard;
