import { Trash } from 'lucide-react'
import React from 'react'
import { db } from '../../../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { Expenses } from '../../../../../utils/schema';

function ExpenseListTable({ expensesList, refreshData }) {

  const deleteExpense = async (expense) => {
    alert("Are you sure you want to delete this expense?");
    const result = await db.delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();
    if (result.length > 0) {
      toast("Expense deleted successfully");
      refreshData();
    }
    else {
      toast("Something went wrong");
    }
  }
  return (
    <div>
      <div className='mt-3'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <div className='grid grid-cols-4 bg-slate-400 p-2 mt-3 gap-3'>
          <h2>Name</h2>
          <h2>Amount</h2>
          <h2>Date</h2>
          <h2>Category</h2>
        </div>
        {expensesList.map((expense) => (
          <div key={expense.id} className='grid grid-cols-4 bg-slate-100 p-3 gap-3'>
            <h2 className='font-bold items'>{expense.name}</h2>
            <h2 className='font-bold'>{expense.amount}</h2>
            <h2 className='font-bold'>{expense.createdAt}</h2>
            <h2>
              <Trash className='text-red-600 cursor-pointer'
                onClick={() => deleteExpense(expense)}
              />
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseListTable
