'use client';

import { motion } from 'framer-motion';

const bubbles = [
  { size: 200, x: '-10%', y: '-5%', duration: 20, delay: 0, color: 'rgba(99,102,241,0.08)' },
  { size: 150, x: '80%', y: '10%', duration: 25, delay: 2, color: 'rgba(244,63,94,0.06)' },
  { size: 180, x: '60%', y: '70%', duration: 22, delay: 4, color: 'rgba(16,185,129,0.07)' },
  { size: 120, x: '20%', y: '60%', duration: 18, delay: 1, color: 'rgba(251,146,60,0.06)' },
  { size: 160, x: '90%', y: '80%', duration: 24, delay: 3, color: 'rgba(99,102,241,0.06)' },
  { size: 100, x: '40%', y: '30%', duration: 19, delay: 5, color: 'rgba(244,63,94,0.05)' },
];

export default function BubbleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            background: `radial-gradient(circle, ${bubble.color}, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, 0, -10, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
