'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function ExpenseRow({ expense, onDelete, delay = 0, showBudget = false }: {
  expense: any; onDelete?: (expense: any) => void; delay?: number; showBudget?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3 bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 mb-2"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {showBudget && expense.budgets && (
            <span className="text-sm">{expense.budgets.icon}</span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm truncate">{expense.name}</h3>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">
            {expense.expense_date
              ? new Date(expense.expense_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : new Date(expense.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
          </span>
          {showBudget && expense.budgets && (
            <span className="text-xs text-gray-400">| {expense.budgets.name}</span>
          )}
        </div>
      </div>
      <p className="font-bold text-emerald-600 text-sm">${Number(expense.amount).toFixed(2)}</p>
      {onDelete && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense);
          }}
          className="p-2 rounded-lg hover:bg-red-50 active:bg-red-100"
        >
          <Trash2 size={16} className="text-red-400" />
        </motion.button>
      )}
    </motion.div>
  );
}
