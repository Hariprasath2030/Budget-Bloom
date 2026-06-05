'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({ value, max, label = '', color = 'indigo' }: { value: number; max: number; label?: string; color?: string }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const gradients = {
    indigo: 'from-indigo-400 to-indigo-600',
    emerald: 'from-emerald-400 to-teal-500',
    rose: 'from-rose-400 to-pink-500',
    amber: 'from-amber-400 to-orange-500',
  };

  const bgColors = {
    indigo: 'bg-indigo-100',
    emerald: 'bg-emerald-100',
    rose: 'bg-rose-100',
    amber: 'bg-amber-100',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className="text-xs font-bold text-gray-800">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full h-2.5 rounded-full ${bgColors[color]} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${gradients[color]}`}
        />
      </div>
    </div>
  );
}
