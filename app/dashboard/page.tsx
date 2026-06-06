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
import { Sparkles, ArrowRight, ChevronRight, TrendingUp, Wallet } from "lucide-react";
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

  const totalBudget = budgetList.reduce((acc, b) => acc + Number(b.amount || 0), 0);
  const totalSpend = budgetList.reduce((acc, b) => acc + Number(b.totalSpend || 0), 0);
  const savingsRate = totalBudget > 0 ? Math.round(((totalBudget - totalSpend) / totalBudget) * 100) : 0;

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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

            {/* Welcome card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-5 sm:p-8 text-white overflow-hidden shadow-xl shadow-blue-500/20"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
              <div className="absolute top-3 right-5 opacity-20">
                <Sparkles size={52} />
              </div>
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">Welcome back</p>
                  <h2 className="font-black text-xl sm:text-4xl mb-1.5 truncate">
                    Hi, {user?.firstName || "Friend"} 👋
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-base font-medium">
                    Your financial snapshot
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-200 font-medium">Live data</span>
                  </div>
                </div>
                {/* Savings pill — mobile only */}
                {totalBudget > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-shrink-0 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2 text-center min-w-[72px]"
                  >
                    <p className="text-lg sm:text-2xl font-black text-white">{savingsRate}%</p>
                    <p className="text-[10px] sm:text-xs text-blue-100 font-semibold leading-tight">saved</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Card Info */}
            <CardInfo budgetList={budgetList} />

            {/* Mobile: Quick budget scroll */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                  <h2 className="font-black text-gray-900 text-base">My Budgets</h2>
                </div>
                <Link href="/dashboard/budgets">
                  <motion.div
                    whileTap={{ scale: 0.93 }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl"
                  >
                    View all
                    <ChevronRight size={12} />
                  </motion.div>
                </Link>
              </div>

              {budgetList.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-3 px-3 snap-x snap-mandatory scrollbar-hide">
                  {budgetList.map((budget, i) => (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex-shrink-0 w-[240px] snap-start"
                    >
                      <BudgetItem budget={budget} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-3 px-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[240px] skeleton h-36 rounded-3xl" />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile: Quick stats row */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">Savings</span>
                </div>
                <p className="text-xl font-black text-gray-900">${(totalBudget - totalSpend).toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{savingsRate}% of budget</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wallet size={14} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">Budgets</span>
                </div>
                <p className="text-xl font-black text-gray-900">{budgetList.length}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Active plans</p>
              </motion.div>
            </div>

            {/* Charts + Budget sidebar (desktop) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
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

              {/* Budget list sidebar (desktop only) */}
              <div className="hidden xl:block space-y-4">
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
