import React from 'react'
import { BarChart, Bar, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xl shadow-black/10">
        <p className="text-sm font-black text-gray-900 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="text-gray-900">${Number(entry.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function BarChartDashboard({ budgetList }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-black text-gray-900 text-lg leading-tight">Budget vs Spending</h2>
          <p className="text-xs text-gray-400 font-medium">Monthly overview</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-500 font-semibold">Spent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-200" />
          <span className="text-xs text-gray-500 font-semibold">Budget</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={budgetList}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          barCategoryGap="35%"
        >
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)", radius: 8 }} />
          <Bar dataKey="totalSpend" stackId="a" fill="url(#spendGrad)" radius={[0, 0, 4, 4]} maxBarSize={40} />
          <Bar dataKey="amount" stackId="a" fill="url(#budgetGrad)" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default BarChartDashboard;
