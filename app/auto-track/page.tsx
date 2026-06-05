'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, X, CreditCard as Edit3, ChevronDown, Sparkles, Bell, BellRing, Plus, Tag, Wallet } from 'lucide-react';
import AnimatedHeader from '../../components/mobile/AnimatedHeader';
import BottomTabs from '../../components/mobile/BottomTabs';
import ProgressBar from '../../components/mobile/ProgressBar';
import {
  getPendingAutoTransactions, getAllAutoTransactions,
  confirmAutoTransaction, dismissAutoTransaction,
  getBudgets, getMerchantCategories,
} from '../../lib/database';
import { AVAILABLE_CATEGORIES, SIMULATED_NOTIFICATIONS, parseNotification, categorize } from '../../lib/autoTrackEngine';
import { showSuccess, showError } from '../../components/mobile/Toast';

export default function AutoTrackScreen() {
  const { user } = useAuth();
  const [pendingTxs, setPendingTxs] = useState<any[]>([]);
  const [allTxs, setAllTxs] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editName, setEditName] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [pending, all, budgetList, categories] = await Promise.all([
        getPendingAutoTransactions(user.id),
        getAllAutoTransactions(user.id),
        getBudgets(user.id),
        getMerchantCategories(),
      ]);
      setPendingTxs(pending);
      setAllTxs(all);
      setBudgets(budgetList);
      setDbCategories(categories);
    } catch (e) {
      showError('Failed to load auto-track data');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmation = (tx: any) => {
    setSelectedTx(tx);
    setEditAmount(String(tx.amount));
    setEditCategory(tx.category || 'Other');
    setEditIcon(AVAILABLE_CATEGORIES.find(c => c.name === (tx.category || 'Other'))?.icon || '💰');
    setEditName(tx.merchant_name || 'Auto-detected expense');
    setSelectedBudget(budgets.length > 0 ? budgets[0].id : '');
  };

  const handleConfirm = async () => {
    if (!selectedTx || !selectedBudget) {
      showError('Please select a budget');
      return;
    }
    setConfirming(true);
    try {
      await confirmAutoTransaction(selectedTx.id, selectedBudget, {
        category: editCategory,
        amount: editAmount,
      });
      showSuccess('Expense saved!');
      setSelectedTx(null);
      loadData();
    } catch {
      showError('Failed to confirm');
    } finally {
      setConfirming(false);
    }
  };

  const handleDismiss = async (tx: any) => {
    try {
      await dismissAutoTransaction(tx.id);
      showSuccess('Transaction dismissed');
      if (selectedTx?.id === tx.id) setSelectedTx(null);
      loadData();
    } catch {
      showError('Failed to dismiss');
    }
  };

  const handleSimulate = async (notificationText: string) => {
    setSimulating(true);
    try {
      const parsed = parseNotification(notificationText);
      const result = categorize(
        { amount: parsed.amount, merchantName: parsed.merchantName, paymentMethod: parsed.paymentMethod, sourceApp: parsed.sourceApp },
        dbCategories
      );

      // Store as pending auto_transaction
      const { createAutoTransaction } = await import('../../lib/database');
      await createAutoTransaction({
        userId: user.id,
        amount: result.amount,
        merchantName: result.merchantName,
        category: result.category,
        paymentMethod: result.paymentMethod,
        sourceApp: result.sourceApp,
        rawNotification: notificationText,
      });
      showSuccess('Transaction auto-detected!');
      loadData();
    } catch {
      showError('Failed to detect');
    } finally {
      setSimulating(false);
    }
  };

  const pendingCount = pendingTxs.length;
  const confirmedTxs = allTxs.filter((t: any) => t.status === 'confirmed');
  const totalAutoTracked = confirmedTxs.reduce((s: number, t: any) => s + Number(t.amount), 0);

  const getCategoryIcon = (category: string) => {
    return AVAILABLE_CATEGORIES.find(c => c.name === category)?.icon || '💰';
  };

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Pending' },
    confirmed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Confirmed' },
    dismissed: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', label: 'Dismissed' },
  };

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4 space-y-5">
        <AnimatedHeader
          title="Auto Track"
          subtitle="Smart expense detection from payment apps"
          gradient="from-violet-600 via-fuchsia-600 to-pink-600"
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
            <p className="text-xs text-amber-600 font-semibold">Pending</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-emerald-700">{confirmedTxs.length}</p>
            <p className="text-xs text-emerald-600 font-semibold">Confirmed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-indigo-700">${totalAutoTracked.toFixed(0)}</p>
            <p className="text-xs text-indigo-600 font-semibold">Auto-Tracked</p>
          </motion.div>
        </div>

        {/* Simulate Detection */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
        >
          <Zap size={18} />
          Simulate Payment Notification
        </motion.button>

        <AnimatePresence>
          {showSimulator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tap to simulate a payment notification</p>
                <div className="flex flex-wrap gap-2">
                  {SIMULATED_NOTIFICATIONS.map((notif, i) => {
                    const parsed = parseNotification(notif);
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        disabled={simulating}
                        onClick={() => handleSimulate(notif)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                      >
                        <span className="text-lg">{getCategoryIcon(parsed.category)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{parsed.merchantName}</p>
                          <p className="text-xs text-violet-600 font-bold">${parsed.amount}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          {(['pending', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {tab === 'pending' ? `Pending (${pendingCount})` : `History (${allTxs.length - pendingCount})`}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        {activeTab === 'pending' ? (
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTxs.map((tx: any, i: number) => {
                const status = statusColors[tx.status] || statusColors.pending;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openConfirmation(tx)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer active:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl"
                      >
                        {getCategoryIcon(tx.category)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{tx.merchant_name || 'Unknown'}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.text} font-semibold`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{tx.category}</span>
                          {tx.source_app && <span className="text-xs text-gray-400">via {tx.source_app}</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.detected_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-lg">${Number(tx.amount).toFixed(2)}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); openConfirmation(tx); }}
                        className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Check size={14} /> Confirm
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); handleDismiss(tx); }}
                        className="py-2 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {!loading && pendingTxs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-5xl mb-4">🔔</p>
                </motion.div>
                <h3 className="text-lg font-bold text-gray-700">No pending transactions</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                  When you receive payment notifications, they'll appear here for quick confirmation
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSimulator(true)}
                  className="mt-4 px-6 py-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 font-semibold text-sm"
                >
                  Try simulation demo
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {allTxs
              .filter((t: any) => t.status !== 'pending')
              .map((tx: any, i: number) => {
                const status = statusColors[tx.status] || statusColors.pending;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                  >
                    <span className="text-xl">{getCategoryIcon(tx.category)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{tx.merchant_name}</h3>
                      <p className="text-xs text-gray-400">{tx.category} | {new Date(tx.detected_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.bg} ${status.text} font-semibold`}>
                      {status.label}
                    </span>
                    <p className="font-bold text-sm text-gray-700">${Number(tx.amount).toFixed(2)}</p>
                  </motion.div>
                );
              })}
            {!loading && allTxs.filter((t: any) => t.status !== 'pending').length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm font-medium">No history yet</p>
              </div>
            )}
          </div>
        )}

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100"
        >
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-violet-500" />
            How Auto-Track Works
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Detect', desc: 'Payment notifications from UPI & banking apps are captured', icon: BellRing },
              { step: '2', title: 'Classify', desc: 'AI auto-detects merchant, amount, and category', icon: Tag },
              { step: '3', title: 'Confirm', desc: 'You review and confirm — expense is saved to your budget', icon: Check },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-violet-700">{item.step}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
            onClick={() => setSelectedTx(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap size={20} className="text-amber-500" />
                  Confirm Expense
                </h2>
                <button onClick={() => setSelectedTx(null)} className="p-2 rounded-xl bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Detected Info Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <BellRing size={16} className="text-amber-600" />
                  </motion.div>
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Auto-detected</span>
                </div>
                {selectedTx.source_app && (
                  <p className="text-xs text-amber-600 mb-1">From {selectedTx.source_app}</p>
                )}
                {selectedTx.raw_notification && (
                  <p className="text-xs text-amber-800/70 italic line-clamp-2">"{selectedTx.raw_notification}"</p>
                )}
              </div>

              {/* Edit Name */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Expense Name</p>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none text-sm font-medium transition-all"
                />
              </div>

              {/* Edit Amount */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Amount</p>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none text-sm font-medium transition-all"
                  inputMode="decimal"
                />
              </div>

              {/* Category Selector */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Category</p>
                <button
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 flex items-center gap-2"
                >
                  <span className="text-lg">{editIcon}</span>
                  <span className="flex-1 text-left text-sm font-medium">{editCategory}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCategoryPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 mt-2">
                        {AVAILABLE_CATEGORIES.map((cat) => (
                          <motion.button
                            key={cat.name}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setEditCategory(cat.name); setEditIcon(cat.icon); setShowCategoryPicker(false); }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              editCategory === cat.name ? 'bg-violet-100 border-violet-300 border-2 text-violet-700' : 'bg-gray-50 border border-gray-200 text-gray-600'
                            }`}
                          >
                            <span>{cat.icon}</span> {cat.name}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Budget Selector */}
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-1.5">Add to Budget</p>
                {budgets.length > 0 ? (
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-violet-500 outline-none text-sm font-medium"
                  >
                    {budgets.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.icon} {b.name} (${Number(b.amount).toFixed(0)} budget)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                    <p className="text-sm text-gray-500">No budgets yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create a budget first to save expenses</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDismiss(selectedTx)}
                  className="py-3.5 px-6 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm"
                >
                  Dismiss
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={confirming || !selectedBudget || !editAmount}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  {confirming ? 'Saving...' : 'Confirm & Save'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabs />
    </div>
  );
}
