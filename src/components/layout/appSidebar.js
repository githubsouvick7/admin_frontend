"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Smartphone,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mobile", href: "/mobile", icon: Smartphone },
  {
    title: "Master Key",
    icon: Layers,
    children: [
      { title: "Brands", href: "/brands", icon: Tags },
      { title: "Models", href: "/models", icon: Layers },
      { title: "Products", href: "/products", icon: Package },
      { title: "Categories", href: "/categories", icon: Layers },
    ],
  },
  { title: "Users", href: "/users", icon: Users },
  { title: "Feedback", href: "/feedback", icon: LogOut },
  { title: "Contact Us", href: "/contactus", icon: LogOut },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (title) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href) =>
    href && (pathname === href || pathname.startsWith(href + "/"));

  const isChildActive = (children) =>
    children?.some((child) => isActive(child.href));

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#111827] text-[#F9FAFB] transition-all duration-300 border-r border-[#374151]",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#374151]">
        {!isCollapsed && (
          <span className="text-xl font-bold text-[#F9FAFB]">Admin Panel</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#F9FAFB] hover:bg-[#1F2937]"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <Collapsible
                  open={
                    !isCollapsed &&
                    (openItems.includes(item.title) ||
                      isChildActive(item.children))
                  }
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isChildActive(item.children)
                          ? "bg-[#2563EB] text-white"
                          : "hover:bg-[#1F2937] text-[#F9FAFB]",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              (openItems.includes(item.title) ||
                                isChildActive(item.children)) &&
                                "rotate-90",
                            )}
                          />
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 pl-10 pr-3 py-2 rounded-md text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-[#2563EB] text-white"
                            : "hover:bg-[#1F2937] text-[#9CA3AF]",
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-[#2563EB] text-white"
                      : "hover:bg-[#1F2937] text-[#F9FAFB]",
                    isCollapsed && "justify-center",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-[#374151] p-4">
        {!isCollapsed && (
          <div>
            <p className="text-sm font-medium text-[#F9FAFB] truncate">
              Souvick
            </p>
            <p className="text-xs text-[#9CA3AF] truncate">
              souvick@example.com
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className="text-[#F9FAFB] hover:bg-[#1F2937]"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  );
}
