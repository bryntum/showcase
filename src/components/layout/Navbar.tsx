"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import { Button } from "components/ui/actions/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { useDarkMode } from "contexts/dark-mode";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const toggleDarkMode = async () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      // Dynamically import DomHelper to avoid SSR issues
      const { DomHelper } = await import("@bryntum/core-thin");
      DomHelper.setTheme("svalbard-light");
    } else {
      document.documentElement.classList.add("dark");
      // Dynamically import DomHelper to avoid SSR issues
      const { DomHelper } = await import("@bryntum/core-thin");
      DomHelper.setTheme("svalbard-dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    toggleDarkMode();
  }, []);

  return (
    <header className="h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-20 flex justify-end px-6">
      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-teal-950"
          onClick={toggleDarkMode}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="sm" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full relative text-teal-950"
            >
              <FontAwesomeIcon icon={faBell} size="sm" />
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
                <p className="text-sm font-medium text-teal-950">
                  Usage limit reached
                </p>
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

export default Navbar;
