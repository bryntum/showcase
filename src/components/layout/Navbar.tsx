"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "components/ui/actions/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { DomHelper } from "@bryntum/core-thin";
import { useDarkMode } from "contexts/dark-mode";

export const Navbar = () => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  useEffect(() => {
    if (pathname === "/" || pathname === "/dashboard") {
      setPageTitle("Dashboard");
    } else if (pathname?.includes("/products/planning")) {
      setPageTitle("Planning");
    } else if (pathname?.includes("/products/drivers")) {
      setPageTitle("Drivers");
    } else if (pathname?.includes("/products/vehicles")) {
      setPageTitle("Vehicles");
    } else if (pathname?.includes("/products/deliveries")) {
      setPageTitle("Deliveries");
    } else if (pathname?.includes("/profile")) {
      setPageTitle("Profile");
    } else if (pathname?.includes("/settings")) {
      setPageTitle("Settings");
    } else {
      setPageTitle("Bryntum Hub");
    }
  }, [pathname]);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      DomHelper.setTheme("stockholm");
    } else {
      document.documentElement.classList.add("dark");
      DomHelper.setTheme("classic-dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl text-teal-950 font-semibold tracking-tight">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-teal-950"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full relative text-teal-950"
            >
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-teal-950">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notifications</div>
            {[1, 2, 3].map((i) => (
              <DropdownMenuItem
                key={i}
                className="flex flex-col items-start p-3 cursor-pointer"
              >
                <p className="text-sm font-medium text-teal-950">Usage limit reached</p>
                <p className="text-xs text-teal-950">
                  Your Bryntum Grid usage has reached 90% of your monthly limit.
                </p>
                <p className="text-xs mt-1 text-teal-950">
                  {i} hour{i > 1 ? "s" : ""} ago
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
