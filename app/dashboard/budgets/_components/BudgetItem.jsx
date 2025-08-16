import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

export default function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(perc, 100).toFixed(2);
  };

  const remaining = budget.amount - (budget.totalSpend || 0);
  const progressPerc = calculateProgressPerc();

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div
        className="relative overflow-hidden p-4 sm:p-6 border border-gray-200 rounded-2xl 
             hover:shadow-2xl cursor-pointer h-auto bg-gradient-to-br 
             from-white via-violet-50/20 to-purple-50/30 
             hover:from-violet-50 hover:to-purple-100 transition-all 
             duration-500 transform hover:-translate-y-2 hover:scale-105 mb-5 group
             sm:mb-5"
      >
        {/* background decorative circles */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-violet-100/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-20 sm:h-20 bg-purple-100/20 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-500"></div>

        {/* header row */}
        <div className="flex gap-2 sm:gap-3 items-center justify-between relative z-10">
          <div className="flex gap-2 sm:gap-3 items-center">
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl p-2 sm:p-3 px-3 sm:px-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl border border-violet-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {budget?.icon}
              </h2>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm sm:text-lg">
                {budget.name}
              </h2>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <Target className="text-violet-500" size={12} sm={14} />
                <h2 className="text-xs sm:text-sm text-gray-600 font-medium">
                  {budget.totalItem} Item{budget.totalItem !== 1 ? "s" : ""}
                </h2>
              </div>
            </div>
          </div>

          <div className="text-right">
            <h2 className="font-bold text-violet-600 text-lg sm:text-xl">
               ₹{budget.amount}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              {remaining >= 0 ? (
                <TrendingUp className="text-emerald-500" size={12} sm={14} />
              ) : (
                <TrendingDown className="text-red-500" size={12} sm={14} />
              )}
              <span
                className={`text-xs sm:text-sm font-medium ${
                  remaining >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {remaining >= 0 ? "On track" : "Over budget"}
              </span>
            </div>
          </div>
        </div>

        {/* progress + stats */}
        <div className="mt-4 sm:mt-6 relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <h2 className="text-xs sm:text-sm text-gray-600 font-semibold">
                 ₹{budget.totalSpend ? budget.totalSpend : 0} Spent
              </h2>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <h2 className="text-xs sm:text-sm text-gray-600 font-semibold">
                 ₹{remaining.toFixed(2)} Remaining
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 h-3 sm:h-4 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-3 sm:h-4 rounded-full transition-all duration-700 ease-out relative ${
                  progressPerc > 90
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : progressPerc > 70
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600"
                }`}
                style={{ width: `${progressPerc}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1 sm:mt-2">
              <span className="text-xs sm:text-sm font-bold text-gray-700">
                {progressPerc}% used
              </span>
              <span
                className={`text-xs sm:text-sm font-bold ${
                  progressPerc > 90
                    ? "text-red-600"
                    : progressPerc > 70
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {progressPerc > 100 ? "Over Budget!" : "Within Budget"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
