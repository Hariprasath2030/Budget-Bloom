@@ .. @@
 "use client";
 import React from "react";
 import Link from "next/link";
 import { usePathname } from "next/navigation";
 import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
+import { Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';

-function SideNav() {
+function SideNav({ isOpen, onClose }) {
+  const theme = useTheme();
+  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
+  
   const menuList = [
     { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
     { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
     { name: "Expenses", icon: ReceiptText, href: "/dashboard/expenses" },
     { name: "Upgrade", icon: ShieldCheck, href: "/dashboard/upgrade" },
   ];

   const path = usePathname();
-  console.log("Current Path:", path); // Debugging

+  const sidebarContent = (
+    <div className="w-64 h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
+      <div className="p-6">
+        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
+      </div>
+      <List className="px-4">
+        {menuList.map((link) => (
+          <ListItem key={link.name} className="mb-2">
+            <Link href={link.href} className="w-full" onClick={isMobile ? onClose : undefined}>
+              <div className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 ${
+                path === link.href 
+                  ? "bg-blue-100 text-blue-600 shadow-md dark:bg-slate-700 dark:text-blue-400" 
+                  : "text-gray-700 dark:text-gray-300"
+              }`}>
+                <link.icon size={24} />
+                <span className="font-medium">{link.name}</span>
+              </div>
+            </Link>
+          </ListItem>
+        ))}
+      </List>
+    </div>
+  );

   return (
-    <div className="h-screen p-5 border shadow-sm w-64 bg-white">
-      
-      <ul className="mt-6 px-8 space-y-6 text-lg">
-        {menuList.map((link) => (
-          <li key={link.name}>
-            <Link href={link.href} className="block">
-              <div className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-primary bg-blue-100" : ""}`}>
-                <link.icon size={24} />
-                <span>{link.name}</span>
-              </div>
-            </Link>
-          </li>
-        ))}
-      </ul>
-    </div>
+    <>
+      {isMobile ? (
+        <Drawer
+          anchor="left"
+          open={isOpen}
+          onClose={onClose}
+          ModalProps={{
+            keepMounted: true,
+          }}
+        >
+          {sidebarContent}
+        </Drawer>
+      ) : (
+        <div className="hidden lg:block h-screen border-r shadow-lg">
+          {sidebarContent}
+        </div>
+      )}
+    </>
   );
 }

 export default SideNav;