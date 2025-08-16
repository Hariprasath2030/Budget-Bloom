import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

export default function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(perc, 100).toFixed(2);
  };

  const remaining = budget.amount - (budget.totalSpend || 0);
  const progressPerc = calculateProgressPerc();

  const remaining = budget.amount - (budget.totalSpend || 0);
  const progressPerc = calculateProgressPerc();

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div className="relative overflow-hidden p-6 border border-gray-200 rounded-2xl hover:shadow-2xl cursor-pointer h-[auto] bg-gradient-to-br from-white via-violet-50/20 to-purple-50/30 hover:from-violet-50 hover:to-purple-100 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 mb-5 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-100/20 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-500"></div>
        
        <div className="flex gap-3 items-center justify-between relative z-10">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <h2 className="text-3xl p-3 px-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl border border-violet-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {budget?.icon}
              </h2>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{budget.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Target className="text-violet-500" size={14} />
                <h2 className="text-sm text-gray-600 font-medium">
                  {budget.totalItem} Item{budget.totalItem !== 1 ? "s" : ""}
                </h2>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-violet-600 text-xl">${budget.amount}</h2>
            <div className="flex items-center gap-1 mt-1">
              {remaining >= 0 ? (
                <TrendingUp className="text-emerald-500" size={14} />
              ) : (
                <TrendingDown className="text-red-500" size={14} />
              )}
              <span className={`text-xs font-medium ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {remaining >= 0 ? 'On track' : 'Over budget'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <h2 className="text-sm text-gray-600 font-semibold">
                ${budget.totalSpend ? budget.totalSpend : 0} Spent
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <h2 className="text-sm text-gray-600 font-semibold">
                ${remaining.toFixed(2)} Remaining
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-700 ease-out relative ${
                  progressPerc > 90 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : progressPerc > 70 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}
                style={{ width: `${progressPerc}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-bold text-gray-700">{progressPerc}% used</span>
              <span className={`text-xs font-bold ${
                progressPerc > 90 ? 'text-red-600' : progressPerc > 70 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {progressPerc > 100 ? 'Over Budget!' : 'Within Budget'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
        <div className="flex gap-3 items-center justify-between relative z-10">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <h2 className="text-3xl p-3 px-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl border border-violet-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {budget?.icon}
              </h2>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{budget.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Target className="text-violet-500" size={14} />
                <h2 className="text-sm text-gray-600 font-medium">
                  {budget.totalItem} Item{budget.totalItem !== 1 ? "s" : ""}
                </h2>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-violet-600 text-xl">${budget.amount}</h2>
            <div className="flex items-center gap-1 mt-1">
              {remaining >= 0 ? (
                <TrendingUp className="text-emerald-500" size={14} />
              ) : (
                <TrendingDown className="text-red-500" size={14} />
              )}
              <span className={`text-xs font-medium ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {remaining >= 0 ? 'On track' : 'Over budget'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <h2 className="text-sm text-gray-600 font-semibold">
                ${budget.totalSpend ? budget.totalSpend : 0} Spent
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <h2 className="text-sm text-gray-600 font-semibold">
                ${remaining.toFixed(2)} Remaining
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-700 ease-out relative ${
                  progressPerc > 90 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : progressPerc > 70 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}
                style={{ width: `${progressPerc}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-bold text-gray-700">{progressPerc}% used</span>
              <span className={`text-xs font-bold ${
                progressPerc > 90 ? 'text-red-600' : progressPerc > 70 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {progressPerc > 100 ? 'Over Budget!' : 'Within Budget'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold text-gray-800">{budget.name}</h2>
              <h2 className="text-sm text-gray-600">
                {budget.totalItem} Item{budget.totalItem !== 1 ? "s" : ""}
              </h2>
            </div>
          </div>
          <h2 className="font-bold text-blue-600 text-lg">${budget.amount}</h2>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs text-gray-500 font-medium">
              ${budget.totalSpend ? budget.totalSpend : 0} Spent
            </h2>
            <h2 className="text-xs text-gray-500 font-medium">
              ${budget.amount - (budget.totalSpend || 0)} Remaining
            </h2>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculateProgressPerc()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
