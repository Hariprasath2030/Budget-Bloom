import React from 'react'
import SideNav from './_components/SideNav'
import Dashboard from './page'
import DashboardHeader from './_components/DashboardHeader'
function DashboardLayout({childern}) {
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block'> 
            <SideNav/>
        </div>
        <div className='relative md:ml-64'>
            <Dashboard
            />
        </div>
        <div className='md:ml-64'>
            <DashboardHeader/>
            {childern}
        </div>
    </div>
  )
}

export default DashboardLayout