'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, CreditCard as Edit3, Plus, X, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import ExpenseRow from '../../../components/mobile/ExpenseRow';
import ProgressBar from '../../../components/mobile/ProgressBar';
import {
  getBudgetDetail, getExpenses, getBudgetSpending,
  addExpense, deleteExpense, updateBudget, deleteBudget,
} from '../../../lib/database';
import { showSuccess, showError } from '../../../components/mobile/Toast';

const EMOJI_OPTIONS = ['💰', '🏠', '🚗', '🍕', '💪', '🎮', '✈️', '📚', '🎨', '🎵', '🛒', '💊'];

export default function BudgetDetailScreen() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && id) loadData();
  }, [user, id]);

  const loadData = async () => {
    try {
      const budgetData = await getBudgetDetail(id);
      setBudget(budgetData);
      setEditName(budgetData.name);
      setEditAmount(String(budgetData.amount));
      setEditIcon(budgetData.icon);

      const expensesData = await getExpenses(id);
      setExpenses(expensesData);

      const spending = await getBudgetSpending(id);
      setTotalSpend(spending);
    } catch {
      showError('Failed to load budget');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseName || !expenseAmount) {
      showError('Please fill in all fields');
      return;
    }
    setSaving(true);
    try {
      await addExpense({ name: expenseName, amount: expenseAmount, budgetId: id, expenseDate });
      showSuccess('Expense added!');
      setShowAddExpense(false);
      setExpenseName('');
      setExpenseAmount('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      loadData();
    } catch {
      showError('Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!editName || !editAmount) {
      showError('Please fill in all fields');
      return;
    }
    setSaving(true);
    try {
      await updateBudget(id, { name: editName, amount: editAmount, icon: editIcon });
      showSuccess('Budget updated!');
      setShowEditBudget(false);
      loadData();
    } catch {
      showError('Failed to update budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!confirm('Delete this budget and all its expenses? This cannot be undone.')) return;
    try {
      await deleteBudget(id);
      showSuccess('Budget deleted');
      router.replace('/budgets');
    } catch {
      showError('Failed to delete budget');
    }
  };

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

  if (loading) {
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

  if (!budget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Budget not found</p>
      </div>
    );
  }

  const amount = Number(budget.amount);
  const remaining = amount - totalSpend;
  const progressPerc = amount > 0 ? Math.min((totalSpend / amount) * 100, 100) : 0;

  return (
    <div className="px-4 pt-6 pb-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()} className="p-2 rounded-xl bg-white shadow-md border border-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900 flex-1 truncate">{budget.name}</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowEditBudget(true)} className="p-2 rounded-xl bg-white shadow-md border border-gray-100">
          <Edit3 size={18} className="text-indigo-600" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleDeleteBudget} className="p-2 rounded-xl bg-white shadow-md border border-gray-100">
          <Trash2 size={18} className="text-red-500" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} className="text-4xl">
              {budget.icon}
            </motion.span>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{budget.name}</h2>
              <p className="text-gray-500 text-sm">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-indigo-600 text-xl">${amount}</p>
            <div className="flex items-center gap-1 justify-end">
              {remaining >= 0 ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
              <span className={`text-xs font-semibold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {remaining >= 0 ? 'On track' : 'Over budget'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500 font-medium">${totalSpend.toFixed(0)} spent</span>
          <span className={`font-semibold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toFixed(0)} {remaining >= 0 ? 'left' : 'over'}
          </span>
        </div>

        <ProgressBar value={totalSpend} max={amount} color={progressPerc > 90 ? 'rose' : progressPerc > 70 ? 'amber' : 'emerald'} />
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowAddExpense(true)}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:shadow-md"
      >
        <Plus size={18} />
        Add Expense
      </motion.button>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Expenses ({expenses.length})</h3>
        <AnimatePresence>
          {expenses.map((expense, i) => (
            <ExpenseRow key={expense.id} expense={expense} onDelete={handleDeleteExpense} delay={i * 0.04} />
          ))}
        </AnimatePresence>
        {expenses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-4xl mb-2">📝</p>
            <p className="text-sm text-gray-400 font-medium">No expenses yet</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Plus size={20} className="text-emerald-500" /> Add Expense
                </h2>
                <button onClick={() => setShowAddExpense(false)} className="p-2 rounded-xl bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <input placeholder="Expense name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-base font-medium transition-all mb-3" />

              <input placeholder="Amount" type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-base font-medium transition-all mb-3" inputMode="decimal" />

              <div className="relative mb-4">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-base font-medium transition-all" />
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddExpense} disabled={saving || !expenseName || !expenseAmount}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-200 disabled:opacity-50">
                {saving ? 'Adding...' : 'Add Expense'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditBudget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
            onClick={() => setShowEditBudget(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Budget</h2>
                <button onClick={() => setShowEditBudget(false)} className="p-2 rounded-xl bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Icon</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <motion.button key={e} whileTap={{ scale: 0.9 }} onClick={() => setEditIcon(e)}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center ${
                        editIcon === e ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110' : 'bg-gray-50'
                      }`}>
                      {e}
                    </motion.button>
                  ))}
                </div>
              </div>

              <input placeholder="Budget name" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-base font-medium transition-all mb-3" />

              <input placeholder="Budget amount" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-base font-medium transition-all mb-4" inputMode="decimal" />

              <motion.button whileTap={{ scale: 0.97 }} onClick={handleUpdateBudget} disabled={saving || !editName || !editAmount}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-indigo-200 disabled:opacity-50">
                {saving ? 'Saving...' : 'Update Budget'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
