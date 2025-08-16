"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import aboutImg from "../../../public/dashboard.png";
import DashboardHeader from "../_components/DashboardHeader";

function AboutPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname(); // Current path

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Budget", icon: PiggyBank, href: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, href: "/dashboard/expensesdashboard" },
    { name: "About us", icon: ShieldCheck, href: "/dashboard/about" },
  ];

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <DashboardHeader />
      </div>

      <div className="flex">
        {/* Hamburger (Mobile Only) */}
        <div className="lg:hidden p-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block h-auto p-5 w-64 bg-white border shadow-sm">
          <ul className="mt-6 px-8 space-y-6 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""
                      }`}
                  >
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar (Mobile) */}
        <div
          className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-white p-5 border shadow-sm z-20 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex justify-end">
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <ul className="mt-10 px-4 space-y-6 text-lg">
            {menuList.map((link) => (
              <li key={link.name}>
                <Link href={link.href}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-md transition hover:text-blue-400 hover:bg-blue-100 ${path === link.href ? "text-blue-600 bg-blue-100 font-semibold" : ""
                      }`}
                  >
                    <link.icon size={24} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <section className="flex-1 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-amber-50/30 min-h-screen py-16 px-4 sm:px-8 lg:px-16">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 mb-16">
            {/* Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-2xl blur-xl"></div>
              <Image
                src={aboutImg}
                alt="About Budget Bloom"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-amber-200"
                priority
              />
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">About Budget Bloom</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Budget Bloom is more than just an expense tracker—it's your personal guide to financial wellness.
                We believe in making finance simple, accessible, and empowering for everyone. Whether you're saving
                for your dreams or managing everyday spending, Budget Bloom keeps you in control.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our platform offers smart visualizations, real-time insights, and budgeting tools tailored to your lifestyle.
                We’re here to help your finances bloom—one thoughtful decision at a time.
              </p>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  href="/dashboard"
                  className="inline-block rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 py-4 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-12">Our Core Values</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Simplicity",
                  desc: "We make budgeting clear, clean, and easy to follow for everyone.",
                  color: "from-violet-500 to-purple-500",
                  bg: "from-violet-50 to-purple-50"
                },
                {
                  title: "Empowerment",
                  desc: "Helping you make better financial decisions with confidence.",
                  color: "from-emerald-500 to-teal-500",
                  bg: "from-emerald-50 to-teal-50"
                },
                {
                  title: "Transparency",
                  desc: "No fluff. Just honest, data-driven insights you can trust.",
                  color: "from-amber-500 to-orange-500",
                  bg: "from-amber-50 to-orange-50"
                },
                {
                  title: "Well-being",
                  desc: "Because smart money leads to a stress-free mind and life.",
                  color: "from-rose-500 to-pink-500",
                  bg: "from-rose-50 to-pink-50"
                },
              ].map((val) => (
                <div key={val.title} className={`p-6 rounded-2xl bg-gradient-to-br ${val.bg} border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${val.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <div className="w-6 h-6 bg-white rounded-lg"></div>
                  </div>
                  <h4 className={`text-xl font-bold bg-gradient-to-r ${val.color} bg-clip-text text-transparent mb-3`}>{val.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
