"use client";

import { useState } from "react";
import cn from "lib/utils";
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
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Sidebar = () => {
  const pathname = usePathname();

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
      className="h-screen bg-sidebar sticky top-0 z-30 flex flex-col shadow-sm border-r border-border w-[250px]"
    >
      <div className="flex items-center h-16 px-4 py-2 border-b border-border">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-sidebar-foreground tracking-tight">
            Bryntum Hub
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <div key={item.name} className="px-3">
            {!item.children ? (
              <Link
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors relative group",
                  isActive(item.path)
                    ? "text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors",
                    item.children.some((child) => isActive(child.path))
                      ? "text-sidebar-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={cn(
                      "transition-transform",
                      expandedGroups[item.name] && "transform rotate-90"
                    )}
                  />
                </button>

                {expandedGroups[item.name] && (
                  <div className="pl-9 space-y-1 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive(child.path)
                            ? "text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <child.icon size={16} />
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

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              admin@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
