"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X, Bell } from "lucide-react";
import DashboardHeader from '../dashboard/_components/DashboardHeader';
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from '../dashboard/_components/CardInfo';
import { Budgets, Expenses } from "../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../utils/dbConfig";
import BarChartDashboard from '../dashboard/_components/BarChartDashboard';
import BudgetItem from "./budgets/_components/BudgetItem";
import EnhancedDataTable from './_components/EnhancedDataTable';
import DateRangeFilter from './_components/DateRangeFilter';
import { toast } from "sonner";

function SideNav() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const path = usePathname();

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
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result.length > 0) {
        toast.success("Expense deleted successfully");
        getBudgetList();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const expenseColumns = [
    { accessorKey: 'name', header: 'Expense Name', cell: ({ getValue }) => <div className="font-medium text-gray-900">{getValue()}</div> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ getValue }) => <div className="font-bold text-green-600 text-lg">${getValue()}</div> },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ getValue }) => <div className="font-medium text-gray-700">{getValue()}</div> },
  ];

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expensesdashboard" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur-md bg-opacity-95">
        <DashboardHeader onLogoClick={() => setSidebarOpen(!isSidebarOpen)} />
      </div>
   <div className="flex">
  <div className="hidden lg:flex fixed top-2 left-2 items-center z-40 space-x-3">
    <button
      onClick={() => setSidebarOpen(!isSidebarOpen)}
      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center"
    >
      {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
    
  </div>
  <div className="lg:hidden fixed top-1 left-1 z-40">
    <button
      onClick={() => setSidebarOpen(!isSidebarOpen)}
      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
    >
    
      {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

   <div
    className={`fixed top-0 left-0 h-screen w-64 md:w-56 lg:w-64 bg-white border shadow-sm z-20 
      transition-transform duration-300
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
  >
    <ul className="mt-20 px-5 space-y-4 text-lg">
      {menuList.map((link) => (
        <li key={link.name}>
          <Link href={link.href}>
            <div
              className={`flex items-center space-x-3 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100
                ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""}`}
            >
              <link.icon size={24} />
              <span>{link.name}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    {/* User info */}
    <div className="absolute bottom-5 left-5 right-5 flex items-center space-x-3">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
      <span className="text-sm font-medium text-gray-800 truncate">{user?.fullName}</span>
    </div>
  </div>


        {/* Main Content */}
  <div
    className={`flex-1 p-4 lg:p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 
      min-h-screen transition-all duration-300
      ${isSidebarOpen ? "lg:ml-64 md:ml-56" : "ml-0"}`}
  >
          
          {/* Welcome Card */}
 <div className="w-full relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 
        rounded-2xl p-6 lg:p-8 mb-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl">Hi, {user?.fullName} 👋</h2>
              <p className="text-violet-100 text-base lg:text-lg mt-2">Welcome back to your financial dashboard!</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-violet-200">Live data updates</span>
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="w-full mt-6">
            <CardInfo budgetList={budgetList} />
          </div>

          {/* Charts & Expenses */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 gap-6">
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

            {/* Latest Budgets */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                  <h2 className="font-bold text-xl lg:text-2xl text-gray-800">Latest Budgets</h2>
                </div>
                <div className="space-y-4">
                  {budgetList.slice(0, 3).map((budget, index) => (
                    <BudgetItem budget={budget} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default SideNav;
