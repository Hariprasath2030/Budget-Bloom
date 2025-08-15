"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Home, TrendingUp } from "lucide-react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";

function SideNav() {
  const menuList = [
    { name: "Dashboard", icon: Home, href: "/dashboard", color: "text-blue-600" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets", color: "text-green-600" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expenses", color: "text-purple-600" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about", color: "text-orange-600" },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-6 border-r border-gray-200 shadow-lg w-64 bg-gradient-to-b from-white to-gray-50">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-200">
        <Image src={img} alt="logo" width={40} height={40} className="rounded-full ring-2 ring-blue-200" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Budget Bloom
        </h1>
      </div>
      
      <ul className="space-y-3 text-base">
        {menuList.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="block group">
              <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
                path === link.href 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105" 
                  : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 text-gray-700 hover:text-gray-900"
              }`}>
                <link.icon 
                  size={22} 
                  className={`${path === link.href ? "text-white" : link.color} transition-colors duration-300`}
                />
                <span className="font-medium">{link.name}</span>
                {path === link.href && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Bottom Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-800">Track Smart</p>
              <p className="text-xs text-gray-600">Save More</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;