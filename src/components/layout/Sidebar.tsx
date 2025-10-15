"use client";

import { useState } from "react";
import cn from "lib/utils";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faChartGantt,
  faCog,
  faBox,
  faChevronRight,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "components/ui/data-display/avatar";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Products",
      icon: faChartBar,
      path: "/products",
      children: [
        { name: "Planning", icon: faChartGantt, path: "/products/planning" },
        { name: "Deliveries", icon: faBox, path: "/products/deliveries" },
        { name: "Vehicles", icon: faTruck, path: "/products/vehicles" },
        // { name: "Drivers", icon: faUsers, path: "/products/drivers" },
      ],
    },
    { name: "Profile", icon: faUser, path: "/profile" },
    { name: "Settings", icon: faCog, path: "/settings" },
  ];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      Products: true,
    }
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <aside
      className={
        "w-[200px] h-screen bg-background sticky top-0 z-30 flex flex-col transition-all duration-300"
      }
    >
      <div className="h-20 flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo/logo_full.svg"
            alt="Showcase Logo"
            width={100}
            height={20}
            className="h-8 pl-4 w-auto"
          />
        </Link>
      </div>

      <div className="border-border border-[1px] rounded-r-3xl mb-8 bg-card flex flex-col justify-between h-full">
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <div key={item.name} className="px-3">
              {!item.children ? (
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-full pl-3 pr-5 py-1 my-1 w-fit transition-colors relative group",
                    isActive(item.path)
                      ? "bg-teal-200 text-teal-800"
                      : "text-teal-950 hover:bg-teal-200"
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} size="sm" />
                  <span>{item.name}</span>
                </Link>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleGroup(item.name)}
                    className={cn(
                      "text-teal-950 flex items-center justify-between gap-3 rounded-full pl-3 pr-5 py-1 my-1 w-fit transition-colors",
                      !item.children.some((child) => isActive(child.path)) &&
                        "hover:bg-teal-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={item.icon} size="sm" />
                      <span>{item.name}</span>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      size="sm"
                      className={cn(
                        "transition-transform",
                        expandedGroups[item.name] && "transform rotate-90"
                      )}
                    />
                  </button>

                  {expandedGroups[item.name] && (
                    <div className="animate-fade-in pl-9">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          className={cn(
                            "flex items-center gap-3 rounded-full pl-3 pr-5 py-1 my-1 text-sm w-fit transition-colors",
                            isActive(child.path)
                              ? "bg-teal-200 !text-event-text"
                              : " hover:bg-teal-200 text-teal-950"
                          )}
                        >
                          <FontAwesomeIcon icon={child.icon} size="sm" />
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-teal-500 mx-6" />

        <div className="p-4 text-teal-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="User profile"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-teal-800 truncate">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
