
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History as HistoryIcon, Search, LogIn } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";
import Image from "next/image";
import { useAuth } from "@/app/layout";
import { Skeleton } from "@/components/ui/skeleton";


export default function HistoryPage() {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [viewedBooks, setViewedBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
          try {
            const storedSearchHistory = localStorage.getItem("litsense_search_history");
            if (storedSearchHistory) {
                setSearchHistory(JSON.parse(storedSearchHistory));
            }
            const storedViewedBooks = localStorage.getItem("litsense_viewed_books");
            if (storedViewedBooks) {
                setViewedBooks(JSON.parse(storedViewedBooks));
            }
          } catch (error) {
              console.error("Failed to parse history from localStorage", error);
              setSearchHistory([]);
              setViewedBooks([]);
          }
        }
        setIsLoading(false);
    }, [isLoggedIn]);

    const clearSearchHistory = () => {
        localStorage.removeItem("litsense_search_history");
        setSearchHistory([]);
    };

    const clearViewedBooks = () => {
        localStorage.removeItem("litsense_viewed_books");
        setViewedBooks([]);
    };
    
    if (!isLoggedIn) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="p-8 border-2 border-dashed rounded-xl bg-muted/50">
              <HistoryIcon className="mx-auto h-16 w-16 text-primary" />
              <h2 className="mt-6 text-2xl font-bold font-headline">Revisit Your Reading Journey</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Log in to keep track of your viewed books and recent searches, all in one place.
              </p>
              <Button asChild className="mt-6">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to View History
                </Link>
              </Button>
            </div>
          </div>
        );
    }
    
    if (isLoading) {
      return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-10 w-1/4 mb-8" />
            <div className="grid gap-8 lg:grid-cols-2">
                <section>
                    <Skeleton className="h-8 w-1/2 mb-4" />
                    <Card className="shadow-lg">
                        <CardContent className="p-4 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-2">
                                     <Skeleton className="w-10 h-14 rounded-sm" />
                                    <div className="flex-grow space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
                <section>
                    <Skeleton className="h-8 w-1/2 mb-4" />
                     <Card className="shadow-lg">
                        <CardContent className="p-4 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <Skeleton className="h-6 w-1/2" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
      )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold font-headline mb-8">History</h1>
            <div className="grid gap-8 lg:grid-cols-2">
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-headline">Recently Viewed Books</h2>
                        {viewedBooks.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={clearViewedBooks}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                    {viewedBooks.length > 0 ? (
                        <Card className="shadow-lg">
                            <CardContent className="p-4 space-y-3">
                                {viewedBooks.map((book) => (
                                    <div key={book.title} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                                         <Image src={book.coverImage || 'https://placehold.co/40x60.png'} alt={book.title} width={40} height={60} className="rounded-sm bg-muted" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{book.title}</p>
                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                        </div>
                                         <Button asChild variant="ghost" size="sm">
                                            <Link href={`/?q=${encodeURIComponent(book.title)}`}>
                                                <Search className="mr-2 h-4 w-4"/>
                                                Find Similar
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                         <div className="text-center py-10 border rounded-lg bg-card">
                            <HistoryIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                            <h3 className="mt-4 text-md font-semibold">No viewed books yet</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Books you select will appear here.
                            </p>
                        </div>
                    )}
                </section>
                 <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-headline">Recent Searches</h2>
                         {searchHistory.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={clearSearchHistory}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                     {searchHistory.length > 0 ? (
                        <Card className="shadow-lg">
                            <CardContent className="p-4">
                                <ul className="space-y-2">
                                    {searchHistory.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <Search className="w-4 h-4 text-primary" />
                                                <span className="font-body text-md">{item}</span>
                                            </div>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/?q=${encodeURIComponent(item)}`}>
                                                    Search again
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center py-10 border rounded-lg bg-card">
                            <Search className="mx-auto h-10 w-10 text-muted-foreground" />
                            <h3 className="mt-4 text-md font-semibold">No search history</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Your past searches will appear here.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
