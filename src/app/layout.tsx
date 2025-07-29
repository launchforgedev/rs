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

export const metadata: Metadata = {
  title: "Litsense",
  description: "AI-Powered Book Recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <header className="flex items-center p-2 md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10">
              <SidebarTrigger />
              <div className="flex items-center justify-center gap-2 flex-1">
                 <LitsenseIcon className="w-7 h-7 text-primary" />
                 <span className="font-headline text-2xl font-bold text-primary">Litsense</span>
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
