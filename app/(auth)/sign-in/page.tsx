'use client';

import { useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError, showLoading, dismissToast } from '../../../components/mobile/Toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const tid = showLoading('Signing in...');

    try {
      await signIn(email, password);
      dismissToast(tid);
      showSuccess('Welcome back!');
      router.replace('/dashboard');
    } catch (error) {
      dismissToast(tid);
      setLoading(false);
      if (error.message.includes('Invalid login')) {
        showError('Invalid email or password');
      } else {
        showError(error.message || 'Sign in failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl mb-4"
        >
          🌸
        </motion.div>
        <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to your Budget Bloom account</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSignIn}
        className="space-y-4"
      >
        <div className="relative">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-base font-medium transition-all"
            autoCapitalize="none"
            autoComplete="email"
          />
        </div>

        <div className="relative">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-base font-medium transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-base shadow-xl shadow-indigo-200 disabled:opacity-50 active:shadow-md transition-shadow"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-gray-500">
          Don't have an account?{' '}
          <button onClick={() => router.push('/sign-up')} className="text-indigo-600 font-bold">
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
