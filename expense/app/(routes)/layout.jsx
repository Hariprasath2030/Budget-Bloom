import React, { use } from 'react'
import Dashboard from './page'
import Dash from './pages/dashboard'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
function DashboardLayout({ childern }) {

  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    user && checkUserBudget();
  }, [user]);

  const checkUserBudget = async () => {
    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAdress))

    console.log(result);
    if (result?.length === 0) {
      router.replace('/dashboard/budgets');
    }
  }
  return (
    <div>
      <div className='relative md:ml-64'>
        <Dashboard
        />
      </div>
      <div className='md:ml-64'>
        <Dash />
        {childern}
      </div>
    </div>
  )
}

export default DashboardLayout