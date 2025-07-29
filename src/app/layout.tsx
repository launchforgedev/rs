
'use client'

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LitsenseIcon } from "@/components/icons";
import { PanelLeft, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);
    
    return (
      <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};


function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/history", label: "History" },
    { path: "/analytics", label: "Analytics" },
    { path: "/contact", label: "Contact" },
  ];
  
  const onLogout = async () => {
    await handleLogout();
    router.push('/');
  }

  return (
    <html lang="en" className="dark">
      <head>
         <title>Litsense</title>
        <meta name="description" content="AI-Powered Book Recommendations" />
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
                {user ? (
                   <Button onClick={onLogout} variant="outline">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </Button>
                ) : (
                  <Button asChild>
                      <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4"/>
                          Login
                      </Link>
                  </Button>
                )}
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}
