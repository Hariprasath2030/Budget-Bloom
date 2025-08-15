import {
  PiggyBank,
  ReceiptText,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    CalculateCardInfo();
  }, [budgetList]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ += Number(element.amount);
      totalSpend_ += element.totalSpend;
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  const remainingBudget = totalBudget - totalSpend;
  const spendingPercentage = totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Total Budget Card - Enhanced with new colors */}
          <div className="group relative overflow-hidden p-6 sm:p-8 border-2 border-emerald-200 rounded-3xl flex items-center justify-between bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 cursor-pointer">
            {/* Enhanced animated background elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-300/40 to-teal-300/40 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-1000 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-300/30 to-emerald-300/30 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-1000 animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-teal-200/20 to-emerald-200/20 rounded-full -translate-x-8 -translate-y-8 group-hover:rotate-180 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-emerald-600 animate-bounce" size={18} />
                <h2 className="text-sm sm:text-base text-emerald-700 font-bold">
                  Total Budget
                </h2>
                <Sparkles className="text-emerald-500 animate-spin" size={14} />
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-emerald-900 mb-3 group-hover:scale-110 transition-transform duration-500">
                ${totalBudget.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500 animate-bounce" size={16} />
                <span className="text-xs sm:text-sm text-green-600 font-bold">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="relative z-10">
              <PiggyBank className="bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 p-3 sm:p-4 h-14 w-14 sm:h-18 sm:w-18 rounded-3xl text-white shadow-2xl group-hover:shadow-emerald-400 group-hover:rotate-12 transition-all duration-700" />
            </div>
          </div>

          {/* Total Spend Card - Enhanced with new colors */}
          <div className="group relative overflow-hidden p-6 sm:p-8 border-2 border-rose-200 rounded-3xl flex items-center justify-between bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 cursor-pointer">
            {/* Enhanced animated background elements */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-rose-300/40 to-pink-300/40 rounded-full -translate-y-14 translate-x-14 group-hover:scale-150 transition-transform duration-1000 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-22 h-22 bg-gradient-to-tr from-red-300/30 to-rose-300/30 rounded-full translate-y-11 -translate-x-11 group-hover:scale-125 transition-transform duration-1000 animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 w-18 h-18 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full -translate-x-9 -translate-y-9 group-hover:rotate-180 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="text-rose-600 animate-pulse" size={18} />
                <h2 className="text-sm sm:text-base text-rose-700 font-bold">
                  Total Spend
                </h2>
                <Zap className="text-rose-500 animate-bounce" size={14} />
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-rose-900 mb-3 group-hover:scale-110 transition-transform duration-500">
                ${totalSpend.toLocaleString()}
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="text-green-500 animate-bounce" size={16} />
                <span className="text-xs sm:text-sm text-green-600 font-bold">
                  -5% from last month
                </span>
              </div>
              {/* Enhanced progress bar */}
              <div className="w-full bg-rose-200 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 h-3 rounded-full transition-all duration-1500 shadow-lg"
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="relative z-10">
              <ReceiptText className="bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 p-3 sm:p-4 h-14 w-14 sm:h-18 sm:w-18 rounded-3xl text-white shadow-2xl group-hover:shadow-rose-400 group-hover:rotate-12 transition-all duration-700" />
            </div>
          </div>

          {/* Active Budgets Card - Enhanced with new colors */}
          <div className="group relative overflow-hidden p-6 sm:p-8 border-2 border-blue-200 rounded-3xl flex items-center justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 cursor-pointer sm:col-span-2 lg:col-span-1">
            {/* Enhanced animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-300/30 to-blue-300/30 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-1000 animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full -translate-x-10 -translate-y-10 group-hover:rotate-180 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Target className="text-blue-600 animate-spin" size={18} />
                <h2 className="text-sm sm:text-base text-blue-700 font-bold">
                  Active Budgets
                </h2>
                <Star className="text-blue-500 animate-pulse" size={14} />
              </div>
              <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-blue-900 mb-3 group-hover:scale-110 transition-transform duration-500">
                {budgetList?.length}
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs sm:text-sm text-blue-600 font-bold">
                  {totalBudget > 0
                    ? `${(((totalBudget - totalSpend) / totalBudget) * 100).toFixed(1)}% remaining`
                    : "No budget set"}
                </span>
              </div>
              {/* Remaining amount with enhanced styling */}
              <div className="text-base sm:text-lg font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full inline-block">
                ${remainingBudget.toLocaleString()} left
              </div>
            </div>
            <div className="relative z-10">
              <Wallet className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-3 sm:p-4 h-14 w-14 sm:h-18 sm:w-18 rounded-3xl text-white shadow-2xl group-hover:shadow-blue-400 group-hover:rotate-12 transition-all duration-700" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-[160px] sm:h-[180px] w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 animate-pulse rounded-3xl flex items-center justify-center relative overflow-hidden shadow-xl"
            >
              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent skew-x-12 animate-pulse delay-500"></div>
              <p className="text-center text-gray-500 font-bold text-base sm:text-lg relative z-10 flex items-center gap-2">
                <Sparkles className="animate-spin" size={20} />
                Loading...
                <Sparkles className="animate-spin" size={20} />
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;