import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import { AppToaster } from "../components/mobile/Toast";
import BubbleBackground from "../components/mobile/BubbleBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budget Bloom",
  description: "Track your expenses and bloom financially!",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <BubbleBackground />
            <div className="relative z-10">
              {children}
            </div>
          </div>
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
