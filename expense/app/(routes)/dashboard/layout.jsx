'use client'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '../../../utils/dbConfig'
import Budgets  from '../../(routes)/dashboard/budgets/page'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'

function DashboardLayout({childern}) {

  const {user} = useUser();
  const router = useRouter();
  useEffect(() => { 
    user&&checkUserBudgets();
  },[user])
  const checkUserBudgets=async()=>
  {
    const result = await db.select()
    .from(Budgets)
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))

    console.log(result);
    if(result?.length==0)
    {
      router.replace('/dashboard/budgets')
    }
  } 
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block'> 
            <SideNav/>
        </div>
        <div className='md:ml-64'>
            <DashboardHeader/>
            {childern}
        </div>
        
    </div>
  )
}

export default DashboardLayout