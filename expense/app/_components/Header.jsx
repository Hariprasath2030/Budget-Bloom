"use client"
import { Button } from '../../components/ui/button';
import React from 'react'
import Image from 'next/image'
import { UserButton, useUser } from '@clerk/nextjs';
import img from '../../public/exlogo.jpg'
import Link from 'next/link'
function Header() {
  const {isSignedIn} = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <div className='text-2xl font-serif font-bold'>Expense Tracker</div>
       <Image src ={img}
       alt = 'logo'
       width = {100}
       height = {100}
       className = 'rounded-full'
       />
       {isSignedIn?
       <UserButton/> : 
       <Link href ={'/sign-in'}>
        <Button>Get Started</Button>
      </Link>
       }
    </div>
  )
}

export default Header