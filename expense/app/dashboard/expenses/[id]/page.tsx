"use client"
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Menu, X, Trash, ArrowLeft, PenBox } from 'lucide-react'; // Added X for close icon
import DashboardHeader from '../../../dashboard/_components/DashboardHeader';  // Assuming DashboardHeader is inside _components folder
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '../../../../utils/schema'
import { db } from '../../../../utils/dbConfig'
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '../../../../components/ui/button';
import EditBudget from './_components/EditBudget';
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
} from "../../../../@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null);
    const [expensesList, setExpensesList] = useState([]);
    const route = useRouter();
    // ✅ Unwrap params using React.use()
    const resolvedParams = params;
    // This ensures `params` is properly resolved before use.

    useEffect(() => {
        if (user) {
            getBudgetInfo();
        }
    }, [user, resolvedParams]); // ✅ Depend on resolvedParams

    const getBudgetInfo = async () => {
        if (!resolvedParams?.id) return; // ✅ Prevent errors if params are still loading

        const result = await db
            .select({
                ...getTableColumns(Budgets),
                totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
            })
            .from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(
                and(
                    eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
                    eq(Budgets.id, resolvedParams.id) // ✅ Use unwrapped params
                )
            )
            .groupBy(...Object.values(getTableColumns(Budgets)));

        setBudgetInfo(result[0]);
        getExpeneslist();

    };

    const getExpeneslist = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, resolvedParams.id))
            .orderBy(desc(Expenses.id));
        setExpensesList(result);
        console.log(result)

    }

    const deleteBudget = async () => {

        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, resolvedParams.id))
            .returning()

        if (deleteExpenseResult) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, resolvedParams.id))
                .returning();
        }
        toast("Budget deleted successfully")
        route.replace('/dashboard/budgets')
    }

    const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle
    const menuList = [
        { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
        { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
        { name: "Expenses", icon: ReceiptText, href: "/dashboard/expenses" },
        { name: "Upgrade", icon: ShieldCheck, href: "/dashboard/upgrade" },
    ];

    const path = usePathname();
    console.log("Current Path:", path); // Debugging

    // Handle hamburger icon click to toggle the sidebar
    const handleHamburgerClick = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Handle close button click to close the sidebar
    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };


    return (
        <>
            <div className="sticky top-0 z-10 bg-white shadow-sm">
                <DashboardHeader />
            </div>
            <div className="flex">
                {/* Hamburger menu on mobile */}
                <div className="lg:hidden p-4">
                    <button
                        className="text-lg"
                        onClick={handleHamburgerClick} // Toggle the sidebar visibility
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Sidebar for Desktop (Always visible on desktop) */}
                <div
                    className="h-screen p-5 border shadow-sm w-64 bg-white hidden lg:block"
                >
                    <ul className="mt-6 px-8 space-y-6 text-lg">
                        {menuList.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="block">
                                    <div
                                        className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-primary bg-blue-100" : ""
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

                {/* Sidebar for Mobile (Toggle visibility on hamburger click) */}
                <div
                    className={`lg:hidden h-screen p-5 border shadow-sm w-64 bg-white fixed top-0 left-0 transition-transform duration-300 ${isSidebarOpen ? "transform translate-x-0" : "transform -translate-x-full"
                        }`}
                >
                    {/* Close button inside the sidebar */}
                    <div className="absolute top-25 right-4">
                        <button onClick={handleCloseSidebar}>
                            <X size={24} />
                        </button>
                    </div>

                    <ul className="mt-30 px-8 space-y-6 text-lg"> {/* Reduced margin-top to 10 */}
                        {menuList.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="block">
                                    <div
                                        className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-primary bg-blue-100" : ""
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
                {/* Page Content */}
                <div className="p-10 w-full">
                    <h2 className="font-bold text-3xl flex justify-between items-center">
                        <span className='flex gap-2 items-center'>
                            <ArrowLeft onClick={() => route.back()} className='cursor-pointer'>
                            </ArrowLeft>
                            My Expense
                        </span>
                        <div className='flex gap-2 items-center'>

                       <EditBudget 
                       budgetInfo={budgetInfo}
                       refreshData={() => getBudgetInfo()}
                       />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="flex gap-2" variant="destructive" size="sm">
                                    <Trash />delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className={undefined}>
                                <AlertDialogHeader className={undefined}>
                                    <AlertDialogTitle className={undefined}>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className={undefined}>
                                        This action cannot be undone. This will permanently delete your current budget along with all its expenses.
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className={undefined}>
                                    <AlertDialogCancel className={undefined}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteBudget()} className={undefined}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    </h2>
                    <br></br>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
                        {budgetInfo ? (
                            <BudgetItem budget={budgetInfo} />
                        ) : (
                            <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-bounce"></div>
                        )}
                        <AddExpense budgetId={resolvedParams.id}
                            user={user}
                            refreshData={() => getBudgetInfo()}
                        /> {/* ✅ Pass unwrapped params */}
                    </div>
                    <div className='mt-4'>
                        <ExpenseListTable
                            expensesList={expensesList}
                            refreshData={() => getBudgetInfo()}

                        />
                    </div>
                </div>
            </div>
        </>
    );
}
