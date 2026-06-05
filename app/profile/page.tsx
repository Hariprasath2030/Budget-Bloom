'use client';

import { useAuth } from '../../lib/auth';
import { motion } from 'framer-motion';
import { LogOut, ChevronRight, Shield, Mail, Calendar } from 'lucide-react';
import { showError, showSuccess, showLoading, dismissToast } from '../../components/mobile/Toast';
import AnimatedHeader from '../../components/mobile/AnimatedHeader';
import BottomTabs from '../../components/mobile/BottomTabs';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (!confirm('Are you sure you want to sign out?')) return;
    const tid = showLoading('Signing out...');
    try {
      await signOut();
      dismissToast(tid);
      showSuccess('Signed out');
    } catch {
      dismissToast(tid);
      showError('Failed to sign out');
    }
  };

  const values = [
    { title: 'Simplicity', desc: 'We make budgeting clear, clean, and easy.', emoji: '✨', color: 'from-indigo-500 to-blue-500' },
    { title: 'Empowerment', desc: 'Helping you make better financial decisions.', emoji: '💪', color: 'from-emerald-500 to-teal-500' },
    { title: 'Transparency', desc: 'No fluff. Just honest, data-driven insights.', emoji: '🔍', color: 'from-amber-500 to-orange-500' },
    { title: 'Well-being', desc: 'Because smart money leads to a stress-free life.', emoji: '🌸', color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-4 space-y-6">
        <AnimatedHeader
          title="Profile"
          subtitle="Your account and about Budget Bloom"
          gradient="from-amber-500 via-orange-500 to-red-500"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md">
              {(user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{user?.email?.split('@')[0] || 'User'}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail size={12} className="text-gray-400" />
                <p className="text-xs text-gray-500 truncate">{user?.email || '—'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-2">
          {[
            { icon: Shield, label: 'Privacy & Security', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: Calendar, label: 'Account created', color: 'text-emerald-600', bg: 'bg-emerald-50', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon size={18} className={item.color} />
              </div>
              <span className="flex-1 font-medium text-sm text-gray-700">{item.label}</span>
              {item.value && <span className="text-sm text-gray-400">{item.value}</span>}
              {!item.value && <ChevronRight size={16} className="text-gray-300" />}
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Our Values</h2>
          <div className="grid grid-cols-2 gap-3">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <span className="text-2xl">{val.emoji}</span>
                <h3 className="font-bold text-sm text-gray-800 mt-2">{val.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🌸</p>
          <h3 className="font-bold text-gray-800">Budget Bloom</h3>
          <p className="text-xs text-gray-500 mt-1">Take control of your finances</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSignOut}
          className="w-full py-4 rounded-2xl bg-white border-2 border-red-200 text-red-600 font-bold text-base flex items-center justify-center gap-2 active:bg-red-50"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>

      <BottomTabs />
    </div>
  );
}
