"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X, ArrowLeft } from 'lucide-react';
import { Budgets, Expenses } from "../../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../../utils/dbConfig";
import DashboardHeader from '../../dashboard/_components/DashboardHeader';
import EnhancedDataTable from '../_components/EnhancedDataTable';
import DateRangeFilter from '../_components/DateRangeFilter';
import { toast } from 'sonner';
import dayjs from 'dayjs';

function ExpensesDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();

  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expensesdashboard" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  useEffect(() => {
    if (user) getBudgetList();
    if (window.innerWidth >= 1024) setSidebarOpen(true); // open sidebar on desktop
  }, [user]);

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
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
    })
    .from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  const deleteExpense = async (expense) => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const result = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();
      if (result.length > 0) {
        toast.success("Expense deleted successfully");
        getBudgetList();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  const expenseColumns = [
    { accessorKey: 'name', header: 'Expense Name', cell: ({ getValue }) => <div className="font-medium text-gray-900">{getValue()}</div> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ getValue }) => <div className="font-bold text-green-600 text-lg">${getValue()}</div> },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ getValue }) => <div className="font-medium text-gray-700">{dayjs(getValue()).format('DD/MM/YYYY')}</div> },
  ];

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur-md bg-opacity-95">
        <DashboardHeader onLogoClick={() => setSidebarOpen(!isSidebarOpen)} />
      </div>

      <div className="flex">
        {/* Desktop toggle */}
        <div className="hidden lg:flex fixed top-2 left-2 items-center z-40 space-x-3">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden fixed top-1 left-1 z-40">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-white rounded-full shadow-lg">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-screen w-64 bg-white border shadow-sm z-20 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <ul className="mt-20 px-5 space-y-4 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div className={`flex items-center space-x-3 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""}`}>
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* User info */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center space-x-3">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            <span className="text-sm font-medium text-gray-800 truncate">{user?.fullName}</span>
          </div>
        </div>

        {/* Page Content */}
        <div className={`p-6 w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"} bg-gradient-to-br from-rose-50/30 via-pink-50/20 to-rose-50/30 min-h-screen`}>
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
            <div className="flex gap-3 items-center">
              <ArrowLeft onClick={() => router.back()} className="cursor-pointer hover:scale-110 transition-transform duration-200" />
              <div>
                <h2 className="font-bold text-2xl lg:text-3xl">My Expense List</h2>
                <p className="text-rose-100 text-sm mt-1">View and manage all your expenses</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <EnhancedDataTable
              data={expensesList}
              columns={expenseColumns}
              title="All Expenses"
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              refreshData={getBudgetList}
              onDelete={deleteExpense}
              enableEditing={true}
              showDateFilter={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpensesDashboard;
