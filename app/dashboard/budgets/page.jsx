"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import DashboardHeader from "../_components/DashboardHeader";
import BudgetList from "./_components/BudgetList";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Budgets() {
  const { user } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const route = useRouter();
  const path = usePathname();

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    {
      name: "Expenses",
      icon: ReceiptText,
      href: "/dashboard/expensesdashboard",
    },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  // Optional: start sidebar open on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <DashboardHeader />
      </div>

      <div className="flex">
        {/* Desktop toggle button */}
        <div className="hidden lg:flex fixed top-2 left-2 items-center z-30 space-x-3">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isSidebarOpen && (
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Budget Bloom
            </h1>
          )}
        </div>

        {/* Mobile toggle button */}
        <div className="lg:hidden fixed top-1 left-1 z-30">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-white border shadow-sm z-20 transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <ul className="mt-20 px-5 space-y-4 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100
                      ${
                        path === link.href
                          ? "text-blue-600 bg-blue-100 font-semibold"
                          : ""
                      }`}
                  >
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* User info */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center space-x-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <span className="text-sm font-medium text-gray-800 truncate">
              {user?.fullName}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`p-8 w-full transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
          }`}
        >
          {/* Welcome / Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
            <div className="flex gap-3 items-center">
              <ArrowLeft
                onClick={() => route.back()}
                className="cursor-pointer hover:scale-110 transition-transform duration-200"
              />
              <div>
                <h2 className="font-bold text-2xl lg:text-3xl">
                  Budget Management
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Create and manage your budgets
                </p>
              </div>
            </div>
          </div>

          {/* Budget List */}
          <BudgetList />
        </div>
      </div>
    </>
  );
}
