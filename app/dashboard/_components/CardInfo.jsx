@@ .. @@
 import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
 import React, { useEffect, useState } from 'react';
+import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
+import { TrendingUp, TrendingDown } from '@mui/icons-material';

 function CardInfo({ budgetList }) {
   const [totalBudget, setTotalBudget] = useState(0);
   const [totalSpend, setTotalSpend] = useState(0);

   useEffect(() => {
     CalculateCardInfo();
   }, [budgetList]);

   const CalculateCardInfo = () => {
     let totalBudget_ = 0;
     let totalSpend_ = 0;

     budgetList.forEach(element => {
       totalBudget_ += Number(element.amount);
       totalSpend_ += element.totalSpend;
     });

     setTotalBudget(totalBudget_);
     setTotalSpend(totalSpend_);
   };

+  const remainingBudget = totalBudget - totalSpend;
+  const spendingPercentage = totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0;

   return (
-    <div>
+    <Box className="mt-6">
       {budgetList?.length > 0 ? (
-        <div className='mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-7'>
-          <div className='p-7 border rounded-lg flex items-center justify-between'>
-            <div>
-              <h2 className='text-sm'>Total Budget</h2>
-              <h2 className='font-bold text-lg'>${totalBudget}</h2>
-            </div>
-            <PiggyBank className='bg-blue-500 p-3 h-12 w-12 rounded-full text-white' />
-          </div>
-          <div className='p-7 border rounded-lg flex items-center justify-between'>
-            <div>
-              <h2 className='text-sm'>Total Spend</h2>
-              <h2 className='font-bold text-lg'>${totalSpend}</h2>
-            </div>
-            <ReceiptText className='bg-blue-500 p-3 h-12 w-12 rounded-full text-white' />
-          </div>
-          <div className='p-7 border rounded-lg flex items-center justify-between'>
-            <div>
-              <h2 className='text-sm'>No. Of Budgets</h2>
-              <h2 className='font-bold text-lg'>{budgetList?.length}</h2>
-            </div>
-            <Wallet className='bg-blue-500 p-3 h-12 w-12 rounded-full text-white' />
-          </div>
-        </div>
+        <Grid container spacing={3}>
+          <Grid item xs={12} sm={6} lg={3}>
+            <Card elevation={4} className="h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
+              <CardContent className="p-6">
+                <Box className="flex items-center justify-between">
+                  <Box>
+                    <Typography variant="body2" className="text-blue-100 mb-1">
+                      Total Budget
+                    </Typography>
+                    <Typography variant="h4" className="font-bold">
+                      ${totalBudget.toLocaleString()}
+                    </Typography>
+                  </Box>
+                  <PiggyBank className="w-12 h-12 text-blue-100" />
+                </Box>
+              </CardContent>
+            </Card>
+          </Grid>
+          
+          <Grid item xs={12} sm={6} lg={3}>
+            <Card elevation={4} className="h-full bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-xl transition-shadow">
+              <CardContent className="p-6">
+                <Box className="flex items-center justify-between">
+                  <Box>
+                    <Typography variant="body2" className="text-red-100 mb-1">
+                      Total Spend
+                    </Typography>
+                    <Typography variant="h4" className="font-bold">
+                      ${totalSpend.toLocaleString()}
+                    </Typography>
+                    <Typography variant="caption" className="text-red-100">
+                      {spendingPercentage}% of budget
+                    </Typography>
+                  </Box>
+                  <ReceiptText className="w-12 h-12 text-red-100" />
+                </Box>
+              </CardContent>
+            </Card>
+          </Grid>
+          
+          <Grid item xs={12} sm={6} lg={3}>
+            <Card elevation={4} className="h-full bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
+              <CardContent className="p-6">
+                <Box className="flex items-center justify-between">
+                  <Box>
+                    <Typography variant="body2" className="text-green-100 mb-1">
+                      Remaining
+                    </Typography>
+                    <Typography variant="h4" className="font-bold">
+                      ${remainingBudget.toLocaleString()}
+                    </Typography>
+                  </Box>
+                  {remainingBudget >= 0 ? (
+                    <TrendingUp className="w-12 h-12 text-green-100" />
+                  ) : (
+                    <TrendingDown className="w-12 h-12 text-green-100" />
+                  )}
+                </Box>
+              </CardContent>
+            </Card>
+          </Grid>
+          
+          <Grid item xs={12} sm={6} lg={3}>
+            <Card elevation={4} className="h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
+              <CardContent className="p-6">
+                <Box className="flex items-center justify-between">
+                  <Box>
+                    <Typography variant="body2" className="text-purple-100 mb-1">
+                      Active Budgets
+                    </Typography>
+                    <Typography variant="h4" className="font-bold">
+                      {budgetList?.length}
+                    </Typography>
+                  </Box>
+                  <Wallet className="w-12 h-12 text-purple-100" />
+                </Box>
+              </CardContent>
+            </Card>
+          </Grid>
+        </Grid>
       ) : (
-        <div className='mt-7 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5'>
+        <Grid container spacing={3} className="mt-4">
           {[1, 2, 3].map((_, index) => (
-            <div
+            <Grid item xs={12} sm={6} lg={4}
               key={index}
-              className='h-[110px] w-full bg-slate-200 animate-bounce rounded-lg'
             >
-              <p className='text-center text-black'>No budget found</p>
-            </div>
+              <Card className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
+                <CardContent className="flex items-center justify-center h-full">
+                  <Typography variant="body1" className="text-gray-600">
+                    No budget found
+                  </Typography>
+                </CardContent>
+              </Card>
+            </Grid>
           ))}
-        </div>
+        </Grid>
       )}
-    </div>
+    </Box>
   );
 }

 export default CardInfo;