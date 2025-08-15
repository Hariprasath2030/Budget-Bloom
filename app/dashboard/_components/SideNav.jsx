"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Home, TrendingUp, Sparkles, Zap, Star } from "lucide-react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";

function SideNav() {
  const menuList = [
    { name: "Dashboard", icon: Home, href: "/dashboard", color: "text-emerald-600", bgColor: "from-emerald-500 to-teal-500" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets", color: "text-rose-600", bgColor: "from-rose-500 to-pink-500" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expenses", color: "text-blue-600", bgColor: "from-blue-500 to-indigo-500" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about", color: "text-orange-600", bgColor: "from-orange-500 to-amber-500" },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-4 sm:p-6 border-r-2 border-rose-200 shadow-2xl w-64 bg-gradient-to-b from-white via-rose-50/40 to-orange-50/40 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-200/30 to-orange-200/30 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/30 to-rose-200/30 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-gradient-to-r from-orange-200/20 to-rose-200/20 rounded-full -translate-x-14 -translate-y-14 animate-spin"></div>
      
      {/* Enhanced Logo Section */}
      <div className="flex items-center space-x-4 mb-10 pb-8 border-b-2 border-rose-200 relative z-10">
        <div className="relative">
          <Image 
            src={img} 
            alt="logo" 
            width={50} 
            height={50} 
            className="rounded-full ring-3 ring-rose-300 shadow-2xl" 
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-rose-400 via-orange-500 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles size={10} className="text-white animate-spin" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Budget Bloom
          </h1>
          <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
            <Star size={10} className="animate-pulse" />
            Financial Freedom
            <Zap size={10} className="animate-bounce" />
          </p>
        </div>
      </div>
      
      <ul className="space-y-3 text-base relative z-10">
        {menuList.map((link, index) => (
          <li key={link.name}>
            <Link href={link.href} className="block group">
              <div className={`flex items-center space-x-4 p-4 rounded-3xl transition-all duration-700 hover:shadow-2xl relative overflow-hidden ${
                path === link.href 
                  ? `bg-gradient-to-r ${link.bgColor} text-white shadow-2xl transform scale-105 border-2 border-white/30` 
                  : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-gray-700 hover:text-gray-900 hover:scale-102"
              }`}>
                {/* Enhanced animated background for active item */}
                {path === link.href && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-60 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-transparent opacity-40 animate-pulse delay-500"></div>
                  </>
                )}
                
                <div className={`p-3 rounded-2xl transition-all duration-500 ${
                  path === link.href 
                    ? "bg-white/30 shadow-2xl backdrop-blur-sm" 
                    : `bg-gradient-to-br from-rose-100 to-orange-100 ${link.color} group-hover:scale-110 shadow-lg`
                }`}>
                  <link.icon 
                    size={22} 
                    className={`transition-all duration-500 ${
                      path === link.href ? "text-white animate-pulse" : `${link.color} group-hover:animate-bounce`
                    }`}
                  />
                </div>
                
                <span className={`font-bold transition-all duration-500 ${
                  path === link.href ? "text-white" : "text-gray-700 group-hover:text-gray-900"
                }`}>
                  {link.name}
                </span>
                
                {path === link.href && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/80 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Enhanced Bottom Section */}
      <div className="absolute bottom-6 left-4 right-4 z-10">
        <div className="bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 p-5 rounded-3xl border-2 border-rose-200 shadow-2xl backdrop-blur-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-200/20 to-amber-200/20 animate-pulse"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3 bg-gradient-to-r from-rose-500 via-orange-600 to-amber-600 rounded-2xl shadow-xl">
              <TrendingUp className="text-white animate-bounce" size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Sparkles size={14} className="text-rose-500 animate-spin" />
                Track Smart
              </p>
              <p className="text-sm text-gray-600 font-semibold">Save More Money</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full shadow-inner animate-pulse"></div>
            <div className="flex-1 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-inner animate-pulse delay-200"></div>
            <div className="flex-1 h-2 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full shadow-inner animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;