import { Oxanium } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../@/components/ui/sonner"

const oxanium = Oxanium({
  subsets: ["latin"],
});

export const metadata = {
  title: "Expense Tracker App",
  description: "Track your expenses and save money!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={oxanium.variable}>
           <Toaster />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
