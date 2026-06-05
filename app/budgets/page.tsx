'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles } from 'lucide-react';
import BudgetCard from '../../components/mobile/BudgetCard';
import AnimatedHeader from '../../components/mobile/AnimatedHeader';
import BottomTabs from '../../components/mobile/BottomTabs';
import { getBudgets, createBudget } from '../../lib/database';
import { showSuccess, showError } from '../../components/mobile/Toast';

const EMOJI_OPTIONS = ['💰', '🏠', '🚗', '🍕', '💪', '🎮', '✈️', '📚', '🎨', '🎵', '🛒', '💊', '🐕', '🎬', '👔', '🎁'];

export default function BudgetsScreen() {
  const { user } = useAuth();
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState('💰');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadBudgets();
  }, [user]);

  const loadBudgets = async () => {
    try {
      const data = await getBudgets(user.id);
      setBudgetList(data);
    } catch {
      showError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name || !amount) {
      showError('Please fill in all fields');
      return;
    }
    setSaving(true);
    try {
      await createBudget({ name, amount, icon, userId: user.id });
      showSuccess('Budget created!');
      setShowCreate(false);
      setName('');
      setAmount('');
      setIcon('💰');
      loadBudgets();
    } catch {
      showError('Failed to create budget');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4 space-y-6">
        <AnimatedHeader
          title="Budgets"
          subtitle="Create and manage your budgets"
          gradient="from-emerald-600 via-teal-600 to-cyan-600"
        />

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreate(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center gap-2 text-emerald-600 font-bold transition-all active:bg-emerald-100"
        >
          <Plus size={20} />
          <span>Create New Budget</span>
        </motion.button>

        <AnimatePresence>
          {budgetList.map((budget, i) => (
            <motion.div key={budget.id} className="mb-3">
              <BudgetCard budget={budget} delay={i * 0.08} />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && budgetList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-5xl mb-4">🌱</p>
            <h3 className="text-lg font-bold text-gray-700">No budgets yet</h3>
            <p className="text-gray-400 text-sm mt-1">Tap the button above to create one</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-emerald-500" />
                  New Budget
                </h2>
                <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Choose an icon</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <motion.button
                      key={e}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIcon(e)}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        icon === e ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-110' : 'bg-gray-50'
                      }`}
                    >
                      {e}
                    </motion.button>
                  ))}
                </div>
              </div>

              <input
                placeholder="Budget name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-base font-medium transition-all mb-3"
              />

              <input
                placeholder="Budget amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-base font-medium transition-all mb-4"
                inputMode="decimal"
              />

              {(name || amount) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-emerald-50 rounded-xl mb-4 flex items-center gap-3"
                >
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{name || 'Budget Name'}</p>
                    <p className="text-emerald-600 font-bold">${amount || '0'}</p>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCreate}
                disabled={saving || !name || !amount}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-200 disabled:opacity-50 active:shadow-md"
              >
                {saving ? 'Creating...' : 'Create Budget'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabs />
    </div>
  );
}
