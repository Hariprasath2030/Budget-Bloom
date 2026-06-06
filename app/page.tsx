"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

const Page = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);
  if (!isLoaded || isSignedIn) return null;

  return (
    <>
      <Header />
      <Hero />
    </>
  );
};

export default Page;
