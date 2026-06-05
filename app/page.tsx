'use client';

import { useAuth } from '../lib/auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Landing() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading]);

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

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-7xl mb-6"
        >
          🌸
        </motion.div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Budget Bloom
        </h1>
        <p className="text-gray-500 mt-3 text-base max-w-xs mx-auto">
          Take control of your finances. Track expenses, set budgets, and bloom financially.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 flex flex-col gap-3 w-full max-w-xs"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push('/sign-in')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-indigo-200 active:shadow-md transition-shadow"
        >
          Sign In
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push('/sign-up')}
          className="w-full py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold text-base shadow-md active:shadow-sm transition-shadow"
        >
          Create Account
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 grid grid-cols-3 gap-6"
      >
        {[
          { emoji: '📊', label: 'Track' },
          { emoji: '💰', label: 'Budget' },
          { emoji: '🚀', label: 'Grow' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.2 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs font-semibold text-gray-500">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
