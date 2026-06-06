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
import { motion, AnimatePresence } from "framer-motion";

const menuList = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-blue-600",
    bg: "bg-blue-50",
    activeBg: "from-blue-500 to-indigo-600",
  },
  {
    name: "Budget",
    icon: PiggyBank,
    href: "/dashboard/budgets",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBg: "from-emerald-500 to-teal-600",
  },
  {
    name: "Expenses",
    icon: ReceiptText,
    href: "/dashboard/expensesdashboard",
    color: "text-rose-600",
    bg: "bg-rose-50",
    activeBg: "from-rose-500 to-pink-600",
  },
  {
    name: "About",
    icon: ShieldCheck,
    href: "/dashboard/about",
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBg: "from-amber-500 to-orange-600",
  },
];

function SideNav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col bg-white border-r border-gray-100 shadow-xl z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="relative">
            <Image src={img} alt="logo" width={40} height={40} className="rounded-2xl ring-2 ring-blue-400/30 shadow-md" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Budget Bloom
            </h1>
            <p className="text-xs text-gray-400 font-medium">Finance Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Main Menu</p>
          {menuList.map((link, i) => {
            const isActive = path === link.href;
            return (
              <Link href={link.href} key={link.name}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${link.activeBg} text-white shadow-lg`
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-white/20" : link.bg
                  }`}>
                    <link.icon size={20} className={isActive ? "text-white" : link.color} />
                  </div>
                  <span className={`relative z-10 font-semibold text-[15px] ${isActive ? "text-white" : ""}`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <div className="relative z-10 ml-auto w-2 h-2 bg-white rounded-full opacity-80" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom card */}
        <div className="px-4 pb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">Track Smart</p>
                <p className="text-xs text-gray-500">Save More Every Month</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl shadow-black/10" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around px-2 py-2">
          {menuList.map((link) => {
            const isActive = path === link.href;
            return (
              <Link href={link.href} key={link.name} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl transition-all duration-200"
                >
                  <motion.div
                    className={`relative w-12 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-br ${link.activeBg} shadow-lg`
                        : "bg-transparent"
                    }`}
                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <link.icon
                      size={20}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"
                      />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-bold leading-none transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}>
                    {link.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default SideNav;
