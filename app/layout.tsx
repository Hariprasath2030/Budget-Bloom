@@ .. @@
 import { Oxanium } from "next/font/google";
 import "./globals.css";
 import { ClerkProvider } from "@clerk/nextjs";
-import { Toaster } from "../@/components/ui/sonner"
+import { Toaster } from "../@/components/ui/sonner";
+import { ThemeProvider, createTheme } from '@mui/material/styles';
+import CssBaseline from '@mui/material/CssBaseline';

+const theme = createTheme({
+  palette: {
+    primary: {
+      main: '#3b82f6',
+    },
+    secondary: {
+      main: '#8b5cf6',
+    },
+  },
+  typography: {
+    fontFamily: 'inherit',
+  },
+});

 const oxanium = Oxanium({
   subsets: ["latin"], // ✅ Add this line
 });

 export const metadata = {
   title: "Budget Bloom App",
   description: "Track your expenses and save money!",
   icons: {
     icon: "/icon.ico", 
   },
    
 };

 export default function RootLayout({ children }) {
   return (
     <ClerkProvider>
       <html lang="en">
         <body
           className={oxanium.className}>
+          <ThemeProvider theme={theme}>
+            <CssBaseline />
             <Toaster />
             {children}
+          </ThemeProvider>
         </body>
       </html>
     </ClerkProvider>
   );
 }