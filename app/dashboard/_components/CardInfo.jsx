import {
  PiggyBank,
  ReceiptText,
  Wallet,
  TrendingUp,
  TrendingDown,
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
        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-blue-200 rounded-xl flex items-center justify-between bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div>
              <h2 className="text-sm text-blue-700 font-medium">
                Total Budget
              </h2>
              <h2 className="font-bold text-2xl text-blue-900">
                ${totalBudget}
              </h2>
              <div className="flex items-center mt-1">
                <TrendingUp className="text-green-500 mr-1" size={14} />
                <span className="text-xs text-green-600">
                  +12% from last month
                </span>
              </div>
            </div>
            <PiggyBank className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 h-14 w-14 rounded-full text-white shadow-lg" />
          </div>

          <div className="p-6 border border-green-200 rounded-xl flex items-center justify-between bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div>
              <h2 className="text-sm text-green-700 font-medium">
                Total Spend
              </h2>
              <h2 className="font-bold text-2xl text-green-900">
                ${totalSpend}
              </h2>
              <div className="flex items-center mt-1">
                <TrendingDown className="text-red-500 mr-1" size={14} />
                <span className="text-xs text-red-600">
                  -5% from last month
                </span>
              </div>
            </div>
            <ReceiptText className="bg-gradient-to-br from-green-500 to-green-600 p-3 h-14 w-14 rounded-full text-white shadow-lg" />
          </div>

          <div className="p-6 border border-purple-200 rounded-xl flex items-center justify-between bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div>
              <h2 className="text-sm text-purple-700 font-medium">
                Active Budgets
              </h2>
              <h2 className="font-bold text-2xl text-purple-900">
                {budgetList?.length}
              </h2>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600">
                  {totalBudget > 0
                    ? `${(
                        ((totalBudget - totalSpend) / totalBudget) *
                        100
                      ).toFixed(1)}% remaining`
                    : "No budget set"}
                </span>
              </div>
            </div>
            <Wallet className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 h-14 w-14 rounded-full text-white shadow-lg" />
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-[140px] w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-bounce rounded-xl flex items-center justify-center"
            >
              <p className="text-center text-gray-500 font-medium ">
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
