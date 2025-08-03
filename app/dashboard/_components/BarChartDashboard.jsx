+@@ .. @@
 import React from 'react'
 import { BarChart, Bar, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
+import { Paper, Typography, Box } from '@mui/material';

 function BarChartDashboard({ budgetList }) {
   return (
-    <>
-      <h2 className='font-bold text-3xl'>Activity</h2>
-      <div className='border rounded-lg p-5'>
-        <ResponsiveContainer width={'80%'} height={300} >
+    <Paper elevation={3} className="p-6 rounded-xl bg-white dark:bg-gray-800">
+      <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-gray-200">
+        Budget vs Spending Activity
+      </Typography>
+      <Box className="w-full">
+        <ResponsiveContainer width="100%" height={350}>
           <BarChart
             data={budgetList}
             margin={{
-              top: 5,
-              right: 5,
-              left: 5,
-              bottom: 5
+              top: 20,
+              right: 30,
+              left: 20,
+              bottom: 20
             }}
           >
-            <XAxis dataKey="name" />
+            <XAxis 
+              dataKey="name" 
+              tick={{ fontSize: 12 }}
+              angle={-45}
+              textAnchor="end"
+              height={80}
+            />
             <YAxis />
-            <Tooltip />
+            <Tooltip 
+              contentStyle={{
+                backgroundColor: '#f8fafc',
+                border: '1px solid #e2e8f0',
+                borderRadius: '8px'
+              }}
+            />
             <Legend />
-            <Bar dataKey='totalSpend' stackId="a" fill="#4845d2" />
-            <Bar dataKey='amount' stackId="a" fill="#C3C2FF" />
-
+            <Bar 
+              dataKey='totalSpend' 
+              name="Total Spent"
+              fill="#ef4444" 
+              radius={[4, 4, 0, 0]}
+            />
+            <Bar 
+              dataKey='amount' 
+              name="Budget Amount"
+              fill="#3b82f6" 
+              radius={[4, 4, 0, 0]}
+            />
           </BarChart>
         </ResponsiveContainer>
-      </div>
-    </>
+      </Box>
+    </Paper>
   )
 }

 export default BarChartDashboard