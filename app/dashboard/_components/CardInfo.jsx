import {
  PiggyBank,
  ReceiptText,
  Wallet,
  TrendingUp,
  TrendingDown,
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

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative p-6 border border-rose-200 rounded-2xl flex items-center justify-between bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-200/30 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-rose-300/20 rounded-full translate-y-8 -translate-x-8"></div>
            <div>
              <h2 className="text-sm text-rose-700 font-bold uppercase tracking-wide">
                Total Budget
              </h2>
              <h2 className="font-bold text-3xl text-rose-900 mt-1">
                ${totalBudget}
              </h2>
              <div className="flex items-center mt-2">
                <TrendingUp className="text-emerald-500 mr-1" size={16} />
                <span className="text-sm text-emerald-600 font-medium">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl blur-sm"></div>
              <PiggyBank className="relative bg-gradient-to-br from-rose-500 to-pink-600 p-4 h-16 w-16 rounded-2xl text-white shadow-2xl" />
            </div>
          </div>

          <div className="relative p-6 border border-orange-200 rounded-2xl flex items-center justify-between bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-300/20 rounded-full translate-y-10 -translate-x-10"></div>
            <div>
              <h2 className="text-sm text-orange-700 font-bold uppercase tracking-wide">
                Total Spend
              </h2>
              <h2 className="font-bold text-3xl text-orange-900 mt-1">
                ${totalSpend}
              </h2>
              <div className="flex items-center mt-2">
                <TrendingDown className="text-red-500 mr-1" size={16} />
                <span className="text-sm text-red-600 font-medium">
                  -5% from last month
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl blur-sm"></div>
              <ReceiptText className="relative bg-gradient-to-br from-orange-500 to-amber-600 p-4 h-16 w-16 rounded-2xl text-white shadow-2xl" />
            </div>
          </div>

          <div className="relative p-6 border border-emerald-200 rounded-2xl flex items-center justify-between bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-200/30 rounded-full -translate-y-14 translate-x-14"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-300/20 rounded-full translate-y-12 -translate-x-12"></div>
            <Sparkles className="absolute top-4 right-4 text-emerald-300 animate-pulse" size={20} />
            <div>
              <h2 className="text-sm text-emerald-700 font-bold uppercase tracking-wide">
                Active Budgets
              </h2>
              <h2 className="font-bold text-3xl text-emerald-900 mt-1">
                {budgetList?.length}
              </h2>
              <div className="flex items-center mt-2">
                <span className="text-sm text-emerald-600 font-medium">
                  {totalBudget > 0
                    ? `${(
                        ((totalBudget - totalSpend) / totalBudget) *
                        100
                      ).toFixed(1)}% remaining`
                    : "No budget set"}
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-sm"></div>
              <Wallet className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-4 h-16 w-16 rounded-2xl text-white shadow-2xl" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-[160px] w-full bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 animate-pulse rounded-2xl flex items-center justify-center shadow-lg"
            >
              <p className="text-center text-gray-500 font-medium text-lg">
                Loading...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
