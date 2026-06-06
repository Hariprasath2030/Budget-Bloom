"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, ChartBar as BarChart3, ArrowRight, Star, CircleCheck as CheckCircle, Smartphone } from "lucide-react";
import img from "../../public/exlogo.jpg";

const features = [
  { icon: TrendingUp, label: "Smart Budgeting", desc: "Set goals & track progress in real time", color: "bg-blue-500" },
  { icon: Shield, label: "Secure & Private", desc: "Your financial data stays safe always", color: "bg-emerald-500" },
  { icon: BarChart3, label: "Visual Analytics", desc: "Beautiful charts for spending insights", color: "bg-amber-500" },
  { icon: Zap, label: "Instant Updates", desc: "Real-time sync across all devices", color: "bg-rose-500" },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "₹2M+", label: "Tracked" },
  { value: "4.9", label: "App Rating" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const Hero = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Mesh gradient */}
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/90" />

        {/* Animated background orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35), rgba(59,130,246,0.2))" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25), rgba(6,182,212,0.15))" }}
          animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2), rgba(236,72,153,0.1))" }}
          animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-blue-100 rounded-full px-4 py-2 mb-8 shadow-lg shadow-blue-500/10"
          >
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-sm font-bold text-gray-700">Smart Finance Manager</span>
            <Star size={13} className="text-amber-400 fill-amber-400" />
          </motion.div>

          {/* Main headline */}
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.88] mb-6"
            >
              <span className="text-gray-900">Take control</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                of money
              </span>
              <br />
              <span className="text-gray-900">like a pro</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10"
            >
              Budget Bloom helps you track expenses, manage budgets, and visualize your financial health — all in one beautifully designed app.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Smartphone size={20} className="relative z-10" />
                  <span className="relative z-10">Start for Free</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </Link>
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.03, borderColor: "#6366f1" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:text-indigo-600 transition-all duration-200 shadow-lg"
                >
                  Create Account
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex items-center justify-center gap-10 sm:gap-16 mb-16">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, type: "spring", stiffness: 70 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-violet-500/20 rounded-3xl blur-3xl transform scale-105" />
            <div className="relative rounded-3xl overflow-hidden border border-white/60 shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none z-10" />
              <Image
                src="/dashboard.png"
                alt="Budget Bloom Dashboard"
                width={1200}
                height={700}
                className="w-full"
                priority
              />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-10 top-1/3 bg-white rounded-2xl shadow-2xl shadow-black/10 p-3 sm:p-4 border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Saved this month</div>
                  <div className="text-lg font-black text-emerald-600">+₹4,200</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-4 sm:-right-10 bottom-1/3 bg-white rounded-2xl shadow-2xl shadow-black/10 p-3 sm:p-4 border border-gray-100 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CheckCircle size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Budget on track</div>
                  <div className="text-lg font-black text-blue-600">78%</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-bold mb-5">
              <Zap size={14} className="fill-blue-500 text-blue-500" />
              Everything you need
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              Built for your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> financial growth</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features wrapped in a beautiful, easy-to-use interface that feels native on any device.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm cursor-default transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <feat.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{feat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto text-center px-4"
        >
          <div className="text-6xl mb-6">🌸</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Start blooming today
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of users who transformed their financial habits with Budget Bloom.
          </p>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black text-lg shadow-xl inline-flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              Get Started Free
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-14 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <Image src={img} alt="logo" width={38} height={38} className="rounded-full ring-2 ring-blue-500/40" />
              <span className="text-white font-black text-xl">Budget Bloom</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
              <a href="https://github.com/Hariprasath2030" className="hover:text-white transition-colors duration-200">GitHub</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <span>&copy; 2025 Budget Bloom. All rights reserved.</span>
            <span>Crafted by <span className="text-blue-400 font-semibold">Hariprasath V</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
