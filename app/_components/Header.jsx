"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import img from "../../public/exlogo.jpg";

function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div className="glass border-b border-white/30 shadow-lg shadow-black/5">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Image
                src={img}
                alt="logo"
                width={38}
                height={38}
                className="rounded-full ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all duration-300"
              />
            </motion.div>
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Budget Bloom
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
                {user && (
                  <span className="text-sm font-semibold text-gray-800 hidden sm:block max-w-[100px] truncate">
                    {user.firstName || "User"}
                  </span>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-sm font-bold text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}
                    whileTap={{ scale: 0.96 }}
                    className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
