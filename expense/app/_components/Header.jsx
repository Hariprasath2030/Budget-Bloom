import { Button } from '../../components/ui/button';
import React from 'react'

const Header = () => {
  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <div className='text-2xl font-serif font-bold'>Expense Tracker</div>
      <Button>Get Started</Button>
    </div>
  )
}

export default Header