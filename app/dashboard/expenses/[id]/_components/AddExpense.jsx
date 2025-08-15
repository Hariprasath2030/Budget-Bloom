"use client"
import React from 'react'
import { useState } from 'react'
import { Input } from "../../../../../@/components/ui/input"
import { Button } from '../../../../../components/ui/button';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import moment from 'moment';
import { Loader } from 'lucide-react';
function AddExpense({ budgetId, user, refreshData }) {

    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [loading, setLoading] = useState(false);
    const addNewExpenses = async () => {
        setLoading(true)
        if (!user) {
            toast.error("User not found! Please log in.");
            setLoading(false);
            return;
        }

        if (!name || !amount) {
            toast.error("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            // ✅ Ensure `budgetId` is a number
            const parsedBudgetId = Number(budgetId);
            if (isNaN(parsedBudgetId)) {
                throw new Error("Invalid budgetId: Not a number.");
            }

            const result = await db.insert(Expenses).values({
                name: name,
                amount: Number(amount), // ✅ Ensure it's a number
                budgetId: parsedBudgetId, // ✅ Corrected budgetId 
                createdAt: moment().format('DD/MM/yyy') // ✅ Store current timestamp
            }).returning({ insertedId: Expenses.id });
            
            setAmount('');
            setName('');
            if (result.length > 0) {
                setLoading(false)
                refreshData();
                toast("New Expense Added!");
            }
            setLoading(false) 
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error("Failed to add expense. Try again!");
            setLoading(false);
        }
    };

    return (
        <div className='bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border-2 border-emerald-200 p-6 rounded-3xl shadow-2xl relative overflow-hidden'>
            {/* Enhanced background decorations */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-200/30 to-emerald-200/30 rounded-full translate-y-8 -translate-x-8 animate-pulse delay-500"></div>
            
            <div className="relative z-10">
                <h2 className='font-bold text-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 flex items-center gap-3'>
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                    Add New Expense
                    <Sparkles className="text-emerald-500 animate-spin" size={20} />
                </h2>
                
                <div className='space-y-6'>
                    <div>
                        <h2 className='text-emerald-700 font-bold text-lg mb-3 flex items-center gap-2'>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Expense Name
                        </h2>
                        <Input
                            placeholder="e.g., Grocery Shopping, Gas, Coffee..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-emerald-200 focus:border-teal-500 focus:ring-teal-200 rounded-2xl h-12 bg-gradient-to-r from-white to-emerald-50/30 shadow-lg"
                        />
                    </div>
                    
                    <div>
                        <h2 className='text-teal-700 font-bold text-lg mb-3 flex items-center gap-2'>
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                            Expense Amount
                        </h2>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-600 font-bold text-xl">$</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border-2 border-teal-200 focus:border-green-500 focus:ring-green-200 rounded-2xl h-12 pl-12 bg-gradient-to-r from-white to-teal-50/30 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
                
                <Button
                    disabled={!(name && amount) || loading}
                    onClick={() => addNewExpenses()}
                    className="mt-8 w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 hover:from-emerald-600 hover:via-teal-700 hover:to-green-700 text-white font-bold py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 relative overflow-hidden group text-lg"
                >
                    {/* Enhanced button effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 -skew-x-12 group-hover:animate-pulse"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Adding Expense...
                            </>
                        ) : (
                            <>
                                <Zap size={20} className="animate-bounce" />
                                Add New Expense
                                <Star size={20} className="animate-pulse" />
                            </>
                        )}
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default AddExpense

                <Input
                    placeholder="Enter Expense Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input
                    placeholder="Enter Expense Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount) || loading}
                onClick={() => addNewExpenses()}
                className="mt-3 w-full">
                    {loading ?
                    <Loader className="animate-spin"/>: "Add New Expense"
                    }
                </Button>
        </div>
    )
}

export default AddExpense
