import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LitsenseIcon } from "@/components/icons";
import { PanelLeft, LogIn } from "lucide-react";
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
    { path: "/analytics", label: "Analytics" },
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
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-sm z-10">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <LitsenseIcon className="h-7 w-7 text-primary" />
                <span className="font-headline text-2xl font-bold text-primary">Litsense</span>
              </Link>
              {menuItems.map((item) => (
                  <Button asChild variant="link" key={item.path} className="text-foreground hover:text-primary text-base">
                    <Link href={item.path}>{item.label}</Link>
                  </Button>
                ))}
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <AppSidebar />
              </SheetContent>
            </Sheet>
             <div className="flex md:hidden items-center justify-start flex-1">
                 <LitsenseIcon className="w-7 h-7 text-primary" />
                 <span className="ml-2 font-headline text-2xl font-bold text-primary">Litsense</span>
            </div>
            <div className="flex items-center gap-4 md:ml-auto">
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4"/>
                        Login
                    </Link>
                </Button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
