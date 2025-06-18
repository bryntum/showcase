"use client";

import { useState } from "react";
import cn from "lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  GanttChart,
  BarChart3,
  User,
  Settings,
  ChevronRight,
  Truck,
  Package2,
  Users,
  ChevronLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    {
      name: "Products",
      icon: BarChart3,
      path: "/products",
      children: [
        { name: "Planning", icon: GanttChart, path: "/products/planning" },
        { name: "Deliveries", icon: Package2, path: "/products/deliveries" },
        { name: "Vehicles", icon: Truck, path: "/products/vehicles" },
        { name: "Drivers", icon: Users, path: "/products/drivers" },
      ],
    },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
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
      className={cn(
        "h-screen bg-sidebar sticky top-0 z-30 flex flex-col shadow-sm border-r border-border transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 px-1 py-2 border-b border-border",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link href="/" className={cn("flex items-center space-x-2")}>
          {isCollapsed ? (
            <Image
              src="/logo/logo_small.svg"
              alt="Showcase Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <Image
              src="/logo/logo_full.svg"
              alt="Showcase Logo"
              width={100}
              height={24}
              className="h-6 w-auto translate-y-0.5"
            />
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <div key={item.name} className={cn("px-3", isCollapsed && "px-2")}>
            {!item.children ? (
              <Link
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors relative group",
                  isActive(item.path)
                    ? "text-sidebar-primary font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>

            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors",
                    item.children.some((child) => isActive(child.path))
                      ? "text-sidebar-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronRight
                      size={16}
                      className={cn(
                        "transition-transform",
                        expandedGroups[item.name] && "transform rotate-90"
                      )}
                    />
                  )}
                </button>

                {expandedGroups[item.name] && (
                  <div
                    className={cn(
                      "animate-fade-in",
                      isCollapsed
                        ? "mt-2 ml-5 border-l border-border/70"
                        : "pl-9"
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                          isActive(child.path)
                            ? "text-sidebar-primary font-semibold"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isCollapsed && "py-1.5"
                        )}
                        title={isCollapsed ? child.name : undefined}
                      >
                        <child.icon size={isCollapsed ? 14 : 16} />
                        {!isCollapsed && <span>{child.name}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={cn("p-4 border-t border-border", isCollapsed && "p-2")}>
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={18} />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin User
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                admin@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
