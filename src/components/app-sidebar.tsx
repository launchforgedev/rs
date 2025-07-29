"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LitsenseIcon } from "@/components/icons";
import { Home, History, Mail } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/",
      label: "Home",
      icon: <Home />,
    },
    {
      path: "/history",
      label: "History",
      icon: <History />,
    },
    {
      path: "/contact",
      label: "Contact",
      icon: <Mail />,
    },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <LitsenseIcon className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-2xl font-bold text-primary">
              Litsense
            </h2>
            <p className="text-xs text-muted-foreground">
              AI Book Recommendations
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <Link href={item.path} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.path}
                  tooltip={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground p-2">
          &copy; {new Date().getFullYear()} Litsense
        </p>
      </SidebarFooter>
    </>
  );
}
