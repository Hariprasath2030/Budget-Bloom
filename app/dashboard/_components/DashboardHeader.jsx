import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

function DashboardHeader({ onLogoClick }) {
  const { user } = useUser();

  return (
    <header className="w-full px-4 sm:px-6 py-3 flex justify-between items-center bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        onClick={onLogoClick}
        whileTap={{ scale: 0.96 }}
      >
        <div className="relative">
          <Image
            src={img}
            alt="logo"
            width={34}
            height={34}
            className="rounded-full ring-2 ring-blue-400/40 group-hover:ring-blue-500/60 transition-all duration-200"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        <h1 className="hidden sm:block text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Budget Bloom
        </h1>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        >
          <Bell size={19} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* User */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-gray-50 border border-gray-200/70 rounded-2xl px-3 py-2 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          <span className="hidden sm:block text-sm font-semibold text-gray-800 truncate max-w-[90px]">
            {user?.firstName || "User"}
          </span>
        </motion.div>
      </div>
    </header>
  );
}

export default DashboardHeader;
