import React from 'react'
import Link from 'next/link'
export default function BudgetItem({ budget }) {

  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(perc, 100).toFixed(2);
  }
  return (
    <Link href={'/dashboard/expenses/' + budget?.id} >
      <div className='p-5 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer h-[170px] bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:-translate-y-1'>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-3 px-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full border border-blue-200'>{budget?.icon}</h2>
            <div>
              <h2 className='font-bold text-gray-800'>{budget.name}</h2>
              <h2 className='text-sm text-gray-600'>{budget.totalItem} Item{budget.totalItem !== 1 ? 's' : ''}</h2>
            </div>
          </div>
          <h2 className='font-bold text-blue-600 text-lg'>${budget.amount}</h2>
        </div>
        <div className='mt-5'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-xs text-gray-500 font-medium'>${budget.totalSpend ? budget.totalSpend : 0} Spent</h2>
            <h2 className='text-xs text-gray-500 font-medium'>${budget.amount - (budget.totalSpend || 0)} Remaining</h2>
          </div>
          <div className='w-full bg-gray-200 h-3 rounded-full overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out'
              style={{
                width: `${calculateProgressPerc()}%`
              }}
            >
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
