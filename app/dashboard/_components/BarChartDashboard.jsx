import React from 'react'
import { BarChart, Bar, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

function BarChartDashboard({ budgetList }) {
  const colors = [
    '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444',
    '#8B5A2B', '#6366F1', '#84CC16', '#F97316'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
        <h2 className='font-bold text-2xl lg:text-3xl text-gray-800'>Financial Activity</h2>
      </div>
      
      <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300'>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Budget vs Spending Analysis</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              <span className="text-gray-600">Total Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full"></div>
              <span className="text-gray-600">Budget Amount</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width={'100%'} height={350} >
          <BarChart
            data={budgetList}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey='totalSpend' 
              stackId="a" 
              fill="url(#spendGradient)"
              radius={[0, 0, 4, 4]}
            />
            <Bar 
              dataKey='amount' 
              stackId="a" 
              fill="url(#budgetGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4B5FD" />
                <stop offset="100%" stopColor="#F3E8FF" />
              </linearGradient>
            </defs>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartDashboard
