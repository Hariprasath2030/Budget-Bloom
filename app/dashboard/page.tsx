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
import PaginatedTable from './_components/PaginatedTable';
import DateRangeFilter from './_components/DateRangeFilter';
import dayjs from 'dayjs';

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

        <div className="hidden lg:block h-auto p-5 w-64 bg-white border shadow-sm">
          <ul className="mt-6 px-8 space-y-6 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""
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
          className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-white p-5 border shadow-sm z-20 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                    className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""
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
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl">Hi, {user?.fullName} 👋</h2>
            <p className="text-blue-100 text-lg mt-2">Welcome back to your financial dashboard!</p>
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
              <PaginatedTable
                expensesList={expensesList}
                dateRange={dateRange}
                refreshData={() => getBudgetList()}
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
