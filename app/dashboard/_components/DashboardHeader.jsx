import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell } from "lucide-react";

function DashboardHeader({ onLogoClick }) {
  const { user } = useUser();
  return (
    <header className="w-full p-2 sm:p-3 shadow-sm border-b border-gray-200 bg-white backdrop-blur-md bg-opacity-95">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div 
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:scale-105"
          onClick={onLogoClick}
        >
          <Image
            src={img}
            alt="logo"
            width={27}
            height={27}
            className="rounded-full ring-1 ring-green-400 hover:ring-2 hover:ring-green-500 transition-all duration-200"
          />
          <h1 className="hidden sm:block text-lg md:text-xl font-bold text-gray-800">
            Budget Bloom
          </h1>
        </div>

        {/* Notifications & User */}
        <div className="flex items-center space-x-2">
          <button className="relative p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200">
            <Bell size={18} />
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
            <span className="hidden sm:block text-sm font-medium text-gray-800 truncate max-w-24">
              {user?.fullName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
