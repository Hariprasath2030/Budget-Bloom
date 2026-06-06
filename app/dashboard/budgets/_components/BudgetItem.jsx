import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetItem({ budget }) {
  const progressPerc = Math.min(((budget.totalSpend || 0) / (budget.amount || 1)) * 100, 100);
  const remaining = (budget.amount || 0) - (budget.totalSpend || 0);
  const isOverBudget = remaining < 0;
  const isWarning = progressPerc > 70;

  const barColor = isOverBudget
    ? "from-red-500 to-red-600"
    : isWarning
    ? "from-amber-400 to-orange-500"
    : "from-emerald-400 to-teal-500";

  const cardAccent = isOverBudget
    ? "border-red-100 bg-gradient-to-br from-red-50/50 to-pink-50/30"
    : isWarning
    ? "border-amber-100 bg-gradient-to-br from-amber-50/50 to-orange-50/30"
    : "border-gray-100 bg-white";

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
        whileTap={{ scale: 0.98 }}
        className={`relative rounded-3xl border p-5 cursor-pointer overflow-hidden transition-shadow duration-300 ${cardAccent}`}
      >
        {/* Decorative bg blob */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />

        {/* Header row */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="text-3xl w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm"
            >
              {budget?.icon}
            </motion.div>
            <div>
              <h3 className="font-black text-gray-900 text-base leading-tight">{budget.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Target size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  {budget.totalItem || 0} item{budget.totalItem !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-blue-600">₹{Number(budget.amount).toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              {!isOverBudget ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={`text-xs font-bold ${isOverBudget ? "text-red-500" : "text-emerald-600"}`}>
                {isOverBudget ? "Over budget" : "On track"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs font-semibold text-gray-600">₹{(budget.totalSpend || 0).toLocaleString()} spent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-gray-600">₹{Math.abs(remaining).toLocaleString()} {isOverBudget ? "over" : "left"}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPerc}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className={`h-full rounded-full bg-gradient-to-r ${barColor} relative`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-bold text-gray-500">{progressPerc.toFixed(0)}% used</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${
              isOverBudget ? "text-red-500" : isWarning ? "text-amber-600" : "text-emerald-600"
            }`}>
              {isOverBudget ? (
                <>Over Budget</>
              ) : isWarning ? (
                <><Zap size={11} />Almost there</>
              ) : (
                <>Within Budget</>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
