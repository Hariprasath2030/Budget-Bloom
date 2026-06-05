'use client';

import { motion } from 'framer-motion';

export default function AnimatedHeader({ title, subtitle, gradient = 'from-indigo-600 via-blue-600 to-cyan-600' }: {
  title: string; subtitle?: string; gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl relative overflow-hidden`}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white relative z-10"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-sm mt-1 relative z-10"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
