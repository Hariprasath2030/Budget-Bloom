'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, ReceiptText, Wallet, Sparkles } from 'lucide-react';
import StatCard from '../../components/mobile/StatCard';
import BudgetCard from '../../components/mobile/BudgetCard';
import ExpenseRow from '../../components/mobile/ExpenseRow';
import AnimatedHeader from '../../components/mobile/AnimatedHeader';
import BottomTabs from '../../components/mobile/BottomTabs';
import { getBudgets, getAllExpenses, deleteExpense } from '../../lib/database';
import { showSuccess, showError } from '../../components/mobile/Toast';
import { useRouter } from 'next/navigation';

export default function DashboardScreen() {
  const { user, loading: authLoading } = useAuth();
  const [budgetList, setBudgetList] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const budgets = await getBudgets(user.id);
      setBudgetList(budgets);
      const expenses = await getAllExpenses(user.id);
      setRecentExpenses(expenses.slice(0, 5));
    } catch (error) {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = budgetList.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpend = budgetList.reduce((s, b) => s + (b.totalSpend || 0), 0);

  const handleDeleteExpense = async (expense) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expense.id);
      showSuccess('Expense deleted');
      loadData();
    } catch {
      showError('Failed to delete');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4 space-y-6">
        <AnimatedHeader
          title={`Hi, ${user?.email?.split('@')[0] || 'there'} 👋`}
          subtitle="Welcome back to your financial dashboard!"
          gradient="from-indigo-600 via-blue-600 to-cyan-600"
        />

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Budget"
            value={`$${totalBudget.toLocaleString()}`}
            icon={PiggyBank}
            gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
            delay={0.1}
          />
          <StatCard
            title="Total Spent"
            value={`$${totalSpend.toLocaleString()}`}
            icon={ReceiptText}
            gradient="linear-gradient(135deg, #f43f5e, #e11d48)"
            delay={0.2}
          />
          <StatCard
            title="Remaining"
            value={`$${(totalBudget - totalSpend).toLocaleString()}`}
            icon={Wallet}
            gradient="linear-gradient(135deg, #10b981, #059669)"
            delay={0.3}
          />
          <StatCard
            title="Budgets"
            value={budgetList.length}
            subtitle={`${budgetList.length} active`}
            icon={Sparkles}
            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
            delay={0.4}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recent Budgets</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/budgets')}
              className="text-indigo-600 text-sm font-semibold"
            >
              View all
            </motion.button>
          </div>
          <div className="space-y-3">
            {budgetList.slice(0, 3).map((budget, i) => (
              <BudgetCard key={budget.id} budget={budget} delay={0.1 + i * 0.1} />
            ))}
            {budgetList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <p className="text-4xl mb-2">🌱</p>
                <p className="font-medium">No budgets yet</p>
                <p className="text-sm">Create your first budget to get started</p>
              </motion.div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Latest Expenses</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/expenses')}
              className="text-indigo-600 text-sm font-semibold"
            >
              View all
            </motion.button>
          </div>
          <AnimatePresence>
            {recentExpenses.map((expense, i) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                onDelete={handleDeleteExpense}
                delay={i * 0.05}
                showBudget
              />
            ))}
            {recentExpenses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 text-gray-400"
              >
                <p className="text-3xl mb-2">🧾</p>
                <p className="font-medium text-sm">No expenses yet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <BottomTabs />
    </div>
  );
}
