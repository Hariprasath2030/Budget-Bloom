"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Home,
  TrendingUp,
  Sparkles,
  Zap,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";

function SideNav() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const path = usePathname();

  const menuList = [
    {
      name: "Dashboard",
      icon: Home,
      href: "/dashboard",
      color: "text-violet-600",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      name: "Budget",
      icon: PiggyBank,
      href: "/dashboard/budgets",
      color: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      name: "Expenses",
      icon: ReceiptText,
      href: "/dashboard/expenses",
      color: "text-rose-600",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      name: "About us",
      icon: ShieldCheck,
      href: "/dashboard/about",
      color: "text-amber-600",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <>
      {/* Toggle button for desktop & mobile */}
      <div className="fixed top-5 left-5 z-30 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen w-64 border-r border-violet-200 shadow-2xl bg-gradient-to-b from-white via-violet-50/30 to-purple-50/50 p-6 transition-transform duration-300 z-20
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
        >
          {/* Floating decorative elements */}
          <div className="absolute top-10 right-4 w-16 h-16 bg-violet-200/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-4 w-12 h-12 bg-purple-200/20 rounded-full animate-bounce"></div>
          <Sparkles
            className="absolute top-20 left-8 text-violet-300 animate-pulse"
            size={20}
          />

          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-violet-200 relative z-10">
            <div className="relative">
              <Image
                src={img}
                alt="logo"
                width={45}
                height={45}
                className="rounded-full ring-2 ring-violet-300 shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Budget Bloom
            </h1>
          </div>

          {/* Menu Items */}
          <ul className="space-y-4 text-base relative z-10">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="block group">
                  <div
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 hover:shadow-xl relative overflow-hidden ${
                      path === link.href
                        ? `bg-gradient-to-r ${link.gradient} text-white shadow-2xl transform scale-105`
                        : "hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 text-gray-700 hover:text-gray-900 hover:scale-102"
                    }`}
                  >
                    {path !== link.href && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <link.icon
                      size={24}
                      className={`${
                        path === link.href ? "text-white" : link.color
                      } transition-all duration-300 group-hover:scale-110 relative z-10`}
                    />
                    <span className="font-semibold relative z-10">
                      {link.name}
                    </span>
                    {path === link.href && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <Zap className="text-white animate-pulse" size={14} />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 p-4 rounded-2xl border border-violet-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-xl">
                  <TrendingUp className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Track Smart</p>
                  <p className="text-xs text-gray-600 font-medium">Save More</p>
                </div>
                <Sparkles
                  className="text-violet-400 animate-pulse ml-auto"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content placeholder */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          } p-6`}
        >
          {/* Your main content goes here */}
        </div>
      </div>
    </>
  );
}

export default SideNav;
