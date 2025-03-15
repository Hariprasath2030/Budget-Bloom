"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import img from "../../../../public/exlogo.jpg";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

function SideNav() {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, path: "/dashboard/budget" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Image src={img} alt="logo" width={50} height={50} className="rounded-full" />
      <div className="mt-5">
        {menuList.map((item) => (
          <Link key={item.id} href={item.path}>
            <div
              className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${
                path === item.path ? "text-primary bg-blue-100" : ""
              }`}
            >
              {React.createElement(item.icon, { className: "w-5 h-5 text-gray-700" })}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;
