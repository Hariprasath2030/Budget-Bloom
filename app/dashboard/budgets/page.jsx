"use client";
import React from "react";
import DashboardHeader from "../_components/DashboardHeader";
import SideNav from "../_components/SideNav";
import BudgetList from "./_components/BudgetList";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, PiggyBank } from "lucide-react";

export default function Budgets() {
  const route = useRouter();

  return (
    <>
      <div className="sticky top-0 z-40">
        <DashboardHeader onLogoClick={() => {}} />
      </div>

      <div className="flex">
        <div className="hidden lg:block">
          <SideNav />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50/50 pb-nav">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white mb-6 overflow-hidden relative shadow-xl shadow-emerald-500/20"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-14 -translate-x-14" />
              <div className="relative z-10 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => route.back()}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft size={18} />
                </motion.button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <PiggyBank size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl sm:text-3xl">My Budgets</h2>
                    <p className="text-emerald-100 text-sm font-medium mt-0.5">Create and manage spending limits</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <BudgetList />
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <SideNav />
      </div>
    </>
  );
}
