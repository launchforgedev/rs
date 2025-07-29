import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LitsenseIcon } from "@/components/icons";
import { Home, History, Mail } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Litsense",
  description: "AI-Powered Book Recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/history", label: "History" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center p-2 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
              <div className="flex items-center md:hidden">
                <SidebarTrigger />
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-1 md:flex-none">
                 <LitsenseIcon className="w-7 h-7 text-primary" />
                 <span className="font-headline text-2xl font-bold text-primary">Litsense</span>
              </div>
              <nav className="hidden md:flex flex-1 justify-center items-center gap-4">
                {menuItems.map((item) => (
                  <Button asChild variant="link" key={item.path} className="text-foreground hover:text-primary">
                    <Link href={item.path}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}