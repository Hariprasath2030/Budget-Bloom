import { PiggyBank } from 'lucide-react'
import React from 'react'

function CardInfo({budgetList}) {
  return (
    <div className='mt-7'>
      <div className='p-7 border rounded-lg flex'>
        <div>
        <h2 className='text-sm'>Total Budget</h2>
        <h2 className='font-bold text-lg'>$15000</h2>
        </div>
        <PiggyBank className='ml-auto text-blue-500' />
      </div>
    </div>
  )
}

export default CardInfo
