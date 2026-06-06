"use client";
import React from "react";
import Link from "next/link";
import DashboardHeader from "../_components/DashboardHeader";
import SideNav from "../_components/SideNav";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const values = [
  { title: "Simplicity", desc: "We make budgeting clear, clean, and easy to follow.", gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-50", border: "border-blue-100" },
  { title: "Empowerment", desc: "Helping you make better financial decisions with confidence.", gradient: "from-emerald-500 to-teal-600", bg: "from-emerald-50 to-teal-50", border: "border-emerald-100" },
  { title: "Transparency", desc: "No fluff. Just honest, data-driven insights you can trust.", gradient: "from-amber-500 to-orange-600", bg: "from-amber-50 to-orange-50", border: "border-amber-100" },
  { title: "Well-being", desc: "Smart money management leads to a stress-free mind.", gradient: "from-rose-500 to-pink-600", bg: "from-rose-50 to-pink-50", border: "border-rose-100" },
];

function AboutPage() {
  const router = useRouter();

  return (
    <>
      <div className="sticky top-0 z-40">
        <DashboardHeader onLogoClick={() => {}} />
      </div>

      <div className="flex">
        <div className="hidden lg:block">
          <SideNav />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50/50 pb-nav">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white overflow-hidden relative shadow-xl shadow-amber-500/20"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative z-10 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => router.back()}
                  className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft size={18} />
                </motion.button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl sm:text-3xl">About Us</h2>
                    <p className="text-amber-100 text-sm mt-0.5 font-medium">Our story and values</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <img src="/dashboard.png" alt="Dashboard" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
              >
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                  About{" "}
                  <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                    Budget Bloom
                  </span>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Budget Bloom is more than just an expense tracker — it's your personal guide to financial wellness. We make finance simple, accessible, and empowering.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Smart visualizations, real-time insights, and budgeting tools tailored to your lifestyle.
                </p>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-200"
                  >
                    Back to Dashboard
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Values */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center"
              >
                Our Core Values
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map((val, i) => (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                    className={`bg-gradient-to-br ${val.bg} border ${val.border} rounded-3xl p-6 transition-shadow duration-300`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${val.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <div className="w-5 h-5 bg-white/80 rounded-lg" />
                    </div>
                    <h4 className={`text-lg font-black bg-gradient-to-r ${val.gradient} bg-clip-text text-transparent mb-2`}>
                      {val.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <SideNav />
      </div>
    </>
  );
}

export default AboutPage;
