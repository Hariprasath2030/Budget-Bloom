import React from 'react'
import BudgetList from './_components/BudgetList'
function BudgetPage() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-5'>Budget</h2>
      <BudgetList/>
    </div>
  )
}

export default BudgetPage
