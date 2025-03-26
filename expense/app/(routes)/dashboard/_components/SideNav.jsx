"use client";
import React from "react";
import Image from "next/image";
import img from "../../../../public/exlogo.jpg";
import Link from "next/link";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

function SideNav() {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  ];

  const path = usePathname();
  console.log("Current Path:", path); // Debugging

  return (
    <div className="h-screen p-5 border shadow-sm w-64 bg-white">
      <Image src={img} alt="logo" width={50} height={50} className="rounded-full" />
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id} className="block">

            <h2
              className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md 
              hover:text-primary hover:bg-blue-100 ${path === menu.path ? "text-primary bg-blue-100" : ""}`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
