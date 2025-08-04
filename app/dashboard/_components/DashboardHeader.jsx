import { UserButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import img from "../../../public/exlogo.jpg";
import { Bell } from "lucide-react";

function DashboardHeader() {
  return (
    <div className="p-4 shadow-md border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 md:from-white md:to-gray-50">
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex flex-col items-start">
          <Image
            src={img}
            alt="logo"
            width={45}
            height={45}
            className="rounded-full ring-2 ring-blue-300"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
            Budget Bloom
          </h1>
        </div>
        <div className="flex items-center space-x-3">
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

      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image
            src={img}
            alt="logo"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-blue-200"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Budget Bloom
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
