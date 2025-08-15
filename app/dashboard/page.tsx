"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X } from "lucide-react"; // Added X for close icon
import DashboardHeader from '../dashboard/_components/DashboardHeader'; // Corrected typo
import { useUser } from "@clerk/nextjs";
import CardInfo from '../dashboard/_components/CardInfo';
import { Budgets, Expenses } from "../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../utils/dbConfig";
import BarChartDashboard from '../dashboard/_components/BarChartDashboard'
import BudgetItem from "./budgets/_components/BudgetItem";
import EnhancedDataTable from './_components/EnhancedDataTable';
import DateRangeFilter from './_components/DateRangeFilter';
import dayjs from 'dayjs';
import { toast } from "sonner";

function SideNav() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  useEffect(() => {
    user && getBudgetList();
  }, [user])

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
  }

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
  }

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
  ];

  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle
  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expensesdashboard" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  const path = usePathname();

  const handleHamburgerClick = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <DashboardHeader />
      </div>

      <div className="flex">
        <div className="lg:hidden p-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden lg:block h-auto p-5 w-64 bg-gradient-to-b from-white via-purple-50/40 to-indigo-50/40 border-2 border-purple-200 shadow-2xl">
        <div className="hidden lg:block h-auto p-5 w-64 bg-gradient-to-b from-white via-rose-50/40 to-orange-50/40 border-2 border-rose-200 shadow-2xl">
          <ul className="mt-6 px-8 space-y-6 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-2xl transition-all duration-500 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 hover:shadow-lg ${path === link.href ? "text-rose-600 bg-gradient-to-r from-rose-100 to-orange-100 font-semibold shadow-lg" : ""
                      }`}
                  >
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-white via-rose-50/40 to-orange-50/40 p-5 border-2 border-rose-200 shadow-2xl z-20 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex justify-end">
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <ul className="mt-10 px-4 space-y-6 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-2xl transition-all duration-500 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 hover:shadow-lg ${path === link.href ? "text-rose-600 bg-gradient-to-r from-rose-100 to-orange-100 font-semibold shadow-lg" : ""
                      }`}
                  >
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-gradient-to-br from-rose-50/30 via-orange-50/30 to-amber-50/30 min-h-screen">
          <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 rounded-3xl p-8 mb-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-500"></div>
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl relative z-10">Hi, {user?.fullName} 👋</h2>
            <p className="text-rose-100 text-lg mt-3 relative z-10 flex items-center gap-2">
              <Sparkles size={20} className="animate-spin" />
              Welcome back to your financial dashboard!
              <Star size={20} className="animate-pulse" />
            </p>
          </div>
          <br></br> 
          <div className="w-full mt-4 animate-bounce'">
            <CardInfo budgetList={budgetList} />
            <br></br>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
            <div className="md:col-span-2 space-y-6">
              <BarChartDashboard
                budgetList={budgetList} />
              <DateRangeFilter 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
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
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="font-bold text-2xl text-gray-800 mb-4">Latest Budgets</h2>
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
