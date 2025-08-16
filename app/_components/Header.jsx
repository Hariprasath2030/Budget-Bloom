"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import img from "../../public/exlogo.jpg";

function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="w-full p-4 sm:p-3 flex justify-between items-center border shadow-md bg-white">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <Image
          src={img}
          alt="logo"
          width={40}
          height={40}
          className="rounded-full ring-1 ring-green-400"
        />
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Budget Bloom
        </h1>
      </div>

      {/* Right side: User or Login */}
      <div className="flex items-center space-x-3">
        {isSignedIn ? (
          <div className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-1 px-3 cursor-pointer transition-all duration-200 shadow-sm">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            {/* Show name next to avatar */}
            {user && (
              <span className="text-sm font-medium text-gray-800">
                {user.firstName || "User"}
              </span>
            )}
          </div>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
