import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell } from "lucide-react";

function DashboardHeader() {
  const { user } = useUser();
  return (
    <header className="w-full p-2 sm:p-3 shadow-sm border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50 md:from-white md:to-gray-50">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 sm:space-x-8">
          <Image
            src={img}
            alt="logo"
            width={28} // smaller on mobile
            height={28}
            className="rounded-full ring-1 ring-green-400"
          />
          <h1 className="text-sm sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Budget Bloom
          </h1>
        </div>

        {/* Notifications & User */}
        <div className="flex items-center space-x-2">
          <button className="relative p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 px-2 hover:shadow-md cursor-pointer transition-all duration-200">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <span className="text-sm font-medium text-gray-800 truncate">
              {user?.fullName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
