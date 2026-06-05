import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import { AppToaster } from "../components/mobile/Toast";
import BubbleBackground from "../components/mobile/BubbleBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Budget Bloom",
  description: "Track your expenses and bloom financially!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
