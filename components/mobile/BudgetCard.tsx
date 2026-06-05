'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function BudgetCard({ budget, delay = 0 }: { budget: any; delay?: number }) {
  const totalSpend = budget.totalSpend || 0;
  const amount = Number(budget.amount);
  const remaining = amount - totalSpend;
  const progressPerc = amount > 0 ? Math.min((totalSpend / amount) * 100, 100) : 0;

  const progressColor =
    progressPerc > 90
      ? 'from-red-400 to-red-500'
      : progressPerc > 70
      ? 'from-amber-400 to-orange-500'
      : 'from-emerald-400 to-teal-500';

  return (
    <Link href={`/budget/${budget.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.4, type: 'spring', bounce: 0.2 }}
        whileTap={{ scale: 0.97 }}
        className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 active:shadow-sm transition-shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: delay + 0.3, duration: 0.4 }}
            >
              {budget.icon}
            </motion.span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{budget.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {budget.totalItem || 0} item{(budget.totalItem || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-indigo-600">${amount}</p>
            <div className="flex items-center gap-1 justify-end">
              {remaining >= 0 ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-red-500" />
              )}
              <span className={`text-xs font-semibold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {remaining >= 0 ? 'On track' : 'Over budget'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>${totalSpend.toFixed(0)} spent</span>
          <span>${remaining.toFixed(0)} left</span>
        </div>

        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPerc}%` }}
            transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
          />
        </div>
      </motion.div>
    </Link>
  );
}
