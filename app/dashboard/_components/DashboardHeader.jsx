import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell, Search } from 'lucide-react';

function DashboardHeader() {
  return (
    <div className='p-4 shadow-md border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-white to-gray-50'>
      <div className='flex items-center space-x-4 lg:hidden'>
        <Image src={img} alt="logo" width={40} height={40} className="rounded-full ring-2 ring-blue-200" />
        <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
          Budget Bloom
        </h1>
      </div>
      
      {/* Search Bar - Hidden on mobile */}
      <div className='hidden md:flex items-center flex-1 max-w-md mx-8'>
        <div className='relative w-full'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
          <input
            type="text"
            placeholder="Search expenses, budgets..."
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
          />
        </div>
      </div>
      
      <div className='flex items-center space-x-4'>
        {/* Notification Bell */}
        <button className='relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'>
          <Bell size={20} />
          <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse'></span>
        </button>
        
        {/* User Button */}
        <div className='ring-2 ring-blue-200 rounded-full'>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader;