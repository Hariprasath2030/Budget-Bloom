@@ .. @@
 import { Trash } from 'lucide-react'
 import React from 'react'
 import { db } from '../../../../../utils/dbConfig';
 import { eq } from 'drizzle-orm';
 import { toast } from 'sonner';
 import { Expenses } from '../../../../../utils/schema';
+import { 
+  Table, 
+  TableBody, 
+  TableCell, 
+  TableContainer, 
+  TableHead, 
+  TableRow, 
+  Paper, 
+  IconButton, 
+  Typography,
+  Box,
+  Chip,
+  useMediaQuery,
+  useTheme,
+  Card,
+  CardContent,
+  Stack
+} from '@mui/material';
+import { Delete as DeleteIcon } from '@mui/icons-material';
+import Pagination from '@mui/material/Pagination';
+import { useState } from 'react';

-function ExpenseListTable({ expensesList, refreshData }) {
+function ExpenseListTable({ expensesList, refreshData }) {
+  const theme = useTheme();
+  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
+  const [page, setPage] = useState(1);
+  const itemsPerPage = 10;
+
+  const handlePageChange = (event, value) => {
+    setPage(value);
+  };
+
+  const paginatedExpenses = expensesList.slice(
+    (page - 1) * itemsPerPage,
+    page * itemsPerPage
+  );
+
+  const totalPages = Math.ceil(expensesList.length / itemsPerPage);

   const deleteExpense = async (expense) => {
     const confirmDelete = confirm("Are you sure you want to delete this expense?");
     if (!confirmDelete) return;

     const result = await db.delete(Expenses)
       .where(eq(Expenses.id, expense.id))
       .returning();

     if (result.length > 0) {
       toast.success("Expense deleted successfully");
       refreshData();
     } else {
       toast.error("Something went wrong");
     }
   }

+  if (isMobile) {
+    return (
+      <Box className="mt-6">
+        <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-gray-200">
+          Latest Expenses ({expensesList.length})
+        </Typography>
+        
+        <Stack spacing={2}>
+          {paginatedExpenses.map((expense) => (
+            <Card key={expense.id} elevation={2} className="hover:shadow-lg transition-shadow">
+              <CardContent className="p-4">
+                <Box className="flex justify-between items-start">
+                  <Box className="flex-1">
+                    <Typography variant="h6" className="font-semibold text-gray-800 dark:text-gray-200">
+                      {expense.name}
+                    </Typography>
+                    <Chip 
+                      label={`$${expense.amount}`} 
+                      color="primary" 
+                      size="small" 
+                      className="mt-1"
+                    />
+                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
+                      {expense.createdAt}
+                    </Typography>
+                  </Box>
+                  <IconButton
+                    onClick={() => deleteExpense(expense)}
+                    color="error"
+                    size="small"
+                  >
+                    <DeleteIcon />
+                  </IconButton>
+                </Box>
+              </CardContent>
+            </Card>
+          ))}
+        </Stack>
+        
+        {totalPages > 1 && (
+          <Box className="flex justify-center mt-6">
+            <Pagination
+              count={totalPages}
+              page={page}
+              onChange={handlePageChange}
+              color="primary"
+              size="large"
+            />
+          </Box>
+        )}
+      </Box>
+    );
+  }

   return (
-    <div className="mt-3 w-full">
-      <h1 className="font-bold text-3xl">Latest Expenses</h1>
-      <br></br>
-      {/* Table Header */}
-      <div className="hidden md:grid grid-cols-4 bg-slate-400 p-3 gap-3 rounded-t-md">
-        <h2 className="font-semibold">Name</h2>
-        <h2 className="font-semibold">Amount</h2>
-        <h2 className="font-semibold">Date</h2>
-        <h2 className="font-semibold">Actions</h2>
-      </div>
-
-      {/* Table Body */}
-      <div className="space-y-3">
-        {expensesList.map((expense) => (
-          <div
-            key={expense.id}
-            className="grid grid-cols-1 md:grid-cols-4 bg-slate-100 p-4 gap-2 rounded-md shadow-sm"
-          >
-            {/* Mobile View Labels */}
-            <div className="md:hidden">
-              <p className="text-sm text-gray-500">Name</p>
-              <h2 className="font-bold">{expense.name}</h2>
-            </div>
-            <div className="md:hidden">
-              <p className="text-sm text-gray-500">Amount</p>
-              <h2 className="font-bold">{expense.amount}</h2>
-            </div>
-            <div className="md:hidden">
-              <p className="text-sm text-gray-500">Date</p>
-              <h2 className="font-bold">{expense.createdAt}</h2>
-            </div>
-            <div className="md:hidden">
-              <p className="text-sm text-gray-500">Actions</p>
-              <Trash
-                className="text-red-600 cursor-pointer"
-                onClick={() => deleteExpense(expense)}
-              />
-            </div>
-
-            {/* Desktop View */}
-            <h2 className="hidden md:block font-bold">{expense.name}</h2>
-            <h2 className="hidden md:block font-bold">{expense.amount}</h2>
-            <h2 className="hidden md:block font-bold">{expense.createdAt}</h2>
-            <div className="hidden md:flex justify-start">
-              <Trash
-                className="text-red-600 cursor-pointer"
-                onClick={() => deleteExpense(expense)}
-              />
-            </div>
-          </div>
-        ))}
-      </div>
-    </div>
+    <Box className="mt-6">
+      <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-gray-200">
+        Latest Expenses ({expensesList.length})
+      </Typography>
+      
+      <TableContainer component={Paper} elevation={3} className="rounded-xl overflow-hidden">
+        <Table>
+          <TableHead className="bg-gradient-to-r from-blue-600 to-purple-600">
+            <TableRow>
+              <TableCell className="text-white font-semibold">Name</TableCell>
+              <TableCell className="text-white font-semibold">Amount</TableCell>
+              <TableCell className="text-white font-semibold">Date</TableCell>
+              <TableCell className="text-white font-semibold" align="center">Actions</TableCell>
+            </TableRow>
+          </TableHead>
+          <TableBody>
+            {paginatedExpenses.map((expense, index) => (
+              <TableRow 
+                key={expense.id} 
+                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
+                  index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'
+                }`}
+              >
+                <TableCell className="font-medium text-gray-800 dark:text-gray-200">
+                  {expense.name}
+                </TableCell>
+                <TableCell>
+                  <Chip 
+                    label={`$${expense.amount}`} 
+                    color="primary" 
+                    variant="outlined"
+                    size="small"
+                  />
+                </TableCell>
+                <TableCell className="text-gray-600 dark:text-gray-400">
+                  {expense.createdAt}
+                </TableCell>
+                <TableCell align="center">
+                  <IconButton
+                    onClick={() => deleteExpense(expense)}
+                    color="error"
+                    size="small"
+                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
+                  >
+                    <DeleteIcon />
+                  </IconButton>
+                </TableCell>
+              </TableRow>
+            ))}
+          </TableBody>
+        </Table>
+      </TableContainer>
+      
+      {totalPages > 1 && (
+        <Box className="flex justify-center mt-6">
+          <Stack spacing={2}>
+            <Pagination
+              count={totalPages}
+              page={page}
+              onChange={handlePageChange}
+              color="primary"
+              size="large"
+              showFirstButton
+              showLastButton
+            />
+          </Stack>
+        </Box>
+      )}
+    </Box>
   )
 }

 export default ExpenseListTable;