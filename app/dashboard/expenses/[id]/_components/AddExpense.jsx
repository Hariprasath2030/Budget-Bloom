"use client"
import React from 'react'
import { useState } from 'react'
import { Input } from "../../../../../@/components/ui/input"
import { Button } from '../../../../../components/ui/button';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import moment from 'moment';
import { Loader, Plus, Calendar, DollarSign, FileText, Sparkles } from 'lucide-react';

function AddExpense({ budgetId, user, refreshData }) {

    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false);
    
    const addNewExpenses = async () => {
        setLoading(true)
        if (!user) {
            toast.error("User not found! Please log in.");
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
                createdAt: moment(selectedDate).format('DD/MM/YYYY') // ✅ Use selected date
            }).returning({ insertedId: Expenses.id });
            
            setAmount('');
            setName('');
            setSelectedDate(moment().format('YYYY-MM-DD'));
            if (result.length > 0) {
                setLoading(false)
                refreshData();
                toast.success("New Expense Added Successfully!");
            }
            setLoading(false) 
        } catch (error) {
            console.error("Error adding expense:", error);
            setLoading(false);
            toast.error("Failed to add expense. Try again!");
        }
    };

    return (
        <div className='relative border border-emerald-200 p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden'>
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/40 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-100/30 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                    <Plus className="text-white" size={20} />
                </div>
                <h2 className='font-bold text-xl text-gray-800'>Add Expense</h2>
                <Sparkles className="text-emerald-400 animate-pulse" size={16} />
            </div>
            
            <div className='space-y-5 relative z-10'>
                <div className='space-y-2'>
                    <div className="flex items-center gap-2">
                        <FileText className="text-emerald-600" size={16} />
                        <h2 className='text-gray-800 font-bold text-sm uppercase tracking-wide'>Expense Name</h2>
                    </div>
                    <Input
                        placeholder="Enter Expense Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                    />
                </div>
                
                <div className='space-y-2'>
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-emerald-600" size={16} />
                        <h2 className='text-gray-800 font-bold text-sm uppercase tracking-wide'>Expense Amount</h2>
                    </div>
                    <Input
                        type="number"
                        placeholder="Enter Expense Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                    />
                </div>
                
                <div className='space-y-2'>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-emerald-600" size={16} />
                        <h2 className='text-gray-800 font-bold text-sm uppercase tracking-wide'>Expense Date</h2>
                    </div>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl"
                    />
                </div>
            </div>
            
            <Button
                disabled={!(name && amount) || loading}
                onClick={() => addNewExpenses()}
                className="mt-6 w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative z-10">
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader className="animate-spin" size={18}/>
                        <span>Adding...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Plus size={18} />
                        <span>Add New Expense</span>
                    </div>
                )}
            </Button>
        </div>
    )
}

export default AddExpense