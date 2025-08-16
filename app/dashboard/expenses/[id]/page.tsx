"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X, Trash, ArrowLeft 
} from 'lucide-react';
import DashboardHeader from '../../../dashboard/_components/DashboardHeader';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '../../../../utils/schema';
import { db } from '../../../../utils/dbConfig';
import { UserButton, useUser } from '@clerk/nextjs';
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

export default function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle
  const route = useRouter();
  const path = usePathname();

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expensesdashboard" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true); // Open sidebar on desktop by default
  }, []);

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
    toast("Budget deleted successfully");
    route.replace('/dashboard/budgets');
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
        getBudgetInfo();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const expenseColumns = [
    { accessorKey: 'name', header: 'Expense Name', cell: ({ getValue }) => <div className="font-medium text-gray-900">{getValue()}</div> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ getValue }) => <div className="font-bold text-green-600 text-lg">${getValue()}</div> },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ getValue }) => <div className="font-medium text-gray-700">{getValue()}</div> },
  ];

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <DashboardHeader />
      </div>

      <div className="flex">
        {/* Desktop sidebar toggle */}
        <div className="hidden lg:flex fixed top-2 left-2 items-center z-30 space-x-3">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {isSidebarOpen && (
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Budget Bloom
            </h1>
          )}
        </div>

        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-1 left-1 z-30">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-white border shadow-sm z-20 transition-transform duration-300
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
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            <span className="text-sm font-medium text-gray-800 truncate">{user?.fullName}</span>
          </div>
        </div>

        {/* Main content */}
        <div className={`p-4 sm:p-10 w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"} bg-gradient-to-br from-violet-50/30 via-purple-50/20 to-indigo-50/30 min-h-screen`}>
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="flex gap-3 items-center">
                <ArrowLeft onClick={() => route.back()} className="cursor-pointer hover:scale-110 transition-transform duration-200" />
                <div>
                  <h2 className="font-bold text-2xl sm:text-3xl">My Expenses</h2>
                  <p className="text-violet-100 text-sm mt-1">Manage your budget expenses</p>
                </div>
              </span>

              <div className="flex gap-3 items-center">
                <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="flex gap-2 bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105" variant="destructive" size="sm">
                      <Trash /> Delete Budget
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-red-200">
                <AlertDialogHeader className="space-y-2">
                    <AlertDialogTitle className="text-red-600 text-lg">
                      Are you absolutely sure?
                    </AlertDialogTitle>
      <AlertDialogDescription className="text-gray-700">
  This action cannot be undone. This will permanently delete your budget and all its expenses.
</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-end gap-2">
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteBudget} className="bg-red-600 hover:bg-red-700 rounded-xl">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Budget and Add Expense */}
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
            {budgetInfo ? <BudgetItem budget={budgetInfo} /> : <div className="h-[200px] w-full bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">Loading...</div>}
            <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
          </div>

          {/* Expenses Table */}
          <div className="mt-8">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <div className="mt-6">
              <EnhancedDataTable
                data={expensesList}
                columns={expenseColumns}
                title="Budget Expenses"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                refreshData={getBudgetInfo}
                onDelete={deleteExpense}
                enableEditing={true}
                showDateFilter={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
