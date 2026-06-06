import {
  PiggyBank,
  ReceiptText,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const cardData = (totalBudget, totalSpend, budgetCount) => [
  {
    label: "Total Budget",
    value: `$${totalBudget.toLocaleString()}`,
    icon: PiggyBank,
    trend: "+12%",
    trendUp: true,
    trendLabel: "vs last month",
    gradient: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-blue-900",
  },
  {
    label: "Total Spend",
    value: `$${totalSpend.toLocaleString()}`,
    icon: ReceiptText,
    trend: "-5%",
    trendUp: false,
    trendLabel: "vs last month",
    gradient: "from-rose-500 to-pink-600",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    valueColor: "text-rose-900",
  },
  {
    label: "Active Budgets",
    value: budgetCount,
    icon: Wallet,
    trend: totalBudget > 0 ? `${(((totalBudget - totalSpend) / totalBudget) * 100).toFixed(0)}% left` : "No budget",
    trendUp: totalBudget > totalSpend,
    trendLabel: "budget remaining",
    gradient: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-900",
  },
];

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    let budget = 0;
    let spend = 0;
    budgetList.forEach((el) => {
      budget += Number(el.amount);
      spend += el.totalSpend;
    });
    setTotalBudget(budget);
    setTotalSpend(spend);
  }, [budgetList]);

  if (budgetList?.length === 0) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="skeleton h-36 rounded-3xl" />
        ))}
      </div>
    );
  }

  const cards = cardData(totalBudget, totalSpend, budgetList?.length);

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 120 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.09)" }}
          className={`relative bg-gradient-to-br ${card.bg} border ${card.border} rounded-3xl p-5 overflow-hidden cursor-default transition-shadow duration-300`}
        >
          <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full`} />
          <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br ${card.gradient} opacity-[0.07] rounded-full`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
                <motion.p
                  key={card.value}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl font-black ${card.valueColor}`}
                >
                  {card.value}
                </motion.p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                <card.icon size={22} className={card.iconColor} />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {card.trendUp ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-rose-500" />
              )}
              <span className={`text-sm font-bold ${card.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                {card.trend}
              </span>
              <span className="text-xs text-gray-400 font-medium">{card.trendLabel}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default CardInfo;
