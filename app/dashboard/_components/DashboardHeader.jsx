@@ .. @@
 import { UserButton } from '@clerk/nextjs'
 import React from 'react'
 import Image from "next/image";
 import img from "../../../public/exlogo.jpg";
+import { Menu as MenuIcon } from '@mui/icons-material';
+import { IconButton } from '@mui/material';

-function DashboardHeader() {
}
+function DashboardHeader({ onMenuClick }) {
   return (
   )
}
-    <div className='p-5 shadow-sm border-b flex justify-between items-center'>
+    <div className='p-3 md:p-5 shadow-lg border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600'>
+      <div className='flex items-center space-x-3'>
+        <IconButton 
+          onClick={onMenuClick}
+          className='lg:hidden text-white hover:bg-white/20'
+          size="large"
+        >
+          <MenuIcon />
+        </IconButton>
         <div className='flex items-center space-x-4'>
-          <Image src={img} alt="logo" width={50} height={50} className="rounded-full" />
-          <h1 className='text-2xl font-bold'>Budget-Bloom</h1>
+          <Image src={img} alt="logo" width={40} height={40} className="rounded-full md:w-12 md:h-12" />
+          <h1 className='text-xl md:text-2xl font-bold text-white'>Budget-Bloom</h1>
         </div>
+      </div>
       <div>
         <UserButton/>
       </div>
     </div>
   )
 }

 export default DashboardHeader;