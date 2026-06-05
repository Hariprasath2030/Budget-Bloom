'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import ExpenseRow from '../../components/mobile/ExpenseRow';
import AnimatedHeader from '../../components/mobile/AnimatedHeader';
import BottomTabs from '../../components/mobile/BottomTabs';
import { getAllExpenses, deleteExpense } from '../../lib/database';
import { showSuccess, showError } from '../../components/mobile/Toast';

export default function ExpensesScreen() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) loadExpenses();
  }, [user]);

  const loadExpenses = async () => {
    try {
      const data = await getAllExpenses(user.id);
      setExpenses(data);
    } catch {
      showError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expense.id);
      showSuccess('Expense deleted');
      loadExpenses();
    } catch {
      showError('Failed to delete');
    }
  };

  const filtered = expenses
    .filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.budgets?.name || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortBy === 'date') return Number(new Date(b.created_at)) - Number(new Date(a.created_at));
      if (sortBy === 'amount') return Number(b.amount) - Number(a.amount);
      return a.name.localeCompare(b.name);
    });

  const totalAmount = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4 space-y-4">
        <AnimatedHeader
          title="Expenses"
          subtitle="All your spending in one place"
          gradient="from-rose-600 via-pink-600 to-red-600"
        />

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-200 focus:border-rose-400 outline-none text-sm font-medium"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all ${
              showFilters ? 'bg-rose-50 border-rose-300' : 'bg-white border-gray-200'
            }`}
          >
            <SlidersHorizontal size={16} className={showFilters ? 'text-rose-600' : 'text-gray-400'} />
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-4 overflow-hidden"
            >
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Sort by</p>
              <div className="flex gap-2">
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'name', label: 'Name' },
                ].map((opt) => (
                  <motion.button
                    key={opt.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      sortBy === opt.key ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-gray-500">
            {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-bold text-rose-600">
            Total: ${totalAmount.toFixed(2)}
          </span>
        </div>

        <AnimatePresence>
          {filtered.map((expense, i) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              onDelete={handleDelete}
              delay={i * 0.03}
              showBudget
            />
          ))}
        </AnimatePresence>

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-5xl mb-4">🧾</p>
            <h3 className="text-lg font-bold text-gray-700">No expenses found</h3>
            <p className="text-gray-400 text-sm mt-1">
              {search ? 'Try a different search term' : 'Add expenses to your budgets'}
            </p>
          </motion.div>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}
