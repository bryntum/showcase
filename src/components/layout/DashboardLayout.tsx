"use client";

import { FC, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { NextLayout } from "types/appRouter";

export const DashboardLayout: FC<NextLayout> = ({ children }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Reset scroll position on page change
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="mx-auto animate-slide-in h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
