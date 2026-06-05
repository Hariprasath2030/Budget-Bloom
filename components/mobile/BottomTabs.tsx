'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Chrome as Home, Wallet, Receipt, User } from 'lucide-react';

const tabs = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Budgets', href: '/budgets', icon: Wallet },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-3 mb-3 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.href)}
                className="relative flex flex-col items-center justify-center py-2 px-4 min-w-[64px] transition-all duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-blue-50 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    animate={{ scale: active ? 1.15 : 1, y: active ? -2 : 0 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                  >
                    <tab.icon
                      size={22}
                      className={active ? 'text-indigo-600' : 'text-gray-400'}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </motion.div>
                  <motion.span
                    animate={{ opacity: active ? 1 : 0.6 }}
                    className={`text-[10px] mt-1 font-semibold ${
                      active ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    {tab.name}
                  </motion.span>
                  {active && (
                    <motion.div
                      layoutId="activeDot"
                      className="w-1 h-1 rounded-full bg-indigo-600 mt-0.5"
                      transition={{ type: 'spring', bounce: 0.4 }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
