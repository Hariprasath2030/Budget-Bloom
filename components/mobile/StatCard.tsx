'use client';

import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }: {
  title: string; value: string | number; subtitle?: string; icon?: any; gradient: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', bounce: 0.3 }}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden rounded-2xl p-5 shadow-lg"
      style={{ background: gradient }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="text-white/80 text-xs font-semibold uppercase tracking-wider"
            >
              {title}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className="text-white font-bold text-3xl mt-1"
            >
              {value}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.4 }}
                className="text-white/70 text-xs mt-1 font-medium"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {Icon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.2, type: 'spring', bounce: 0.5 }}
              className="bg-white/20 p-3 rounded-xl"
            >
              <Icon size={24} className="text-white" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
