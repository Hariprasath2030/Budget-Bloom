import { UserButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="w-full p-4 shadow-md border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 md:from-white md:to-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
    
        <div className="flex items-center space-x-3">
          <Image
            src={img}
            alt="logo"
            width={50}
            height={50}
            className="rounded-full ring-2 ring-blue-300"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Budget Bloom
          </h1>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
