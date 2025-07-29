"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, DonutChart } from '@tremor/react';
import { BarChart2, BookOpen, ThumbsUp, Users, LogIn } from "lucide-react";
import type { Book } from "@/types";

type GenreData = {
  name: string;
  count: number;
};

export default function AnalyticsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
  const [viewedBooks, setViewedBooks] = useState<Book[]>([]);
  const [genreData, setGenreData] = useState<GenreData[]>([]);

  useEffect(() => {
    // In a real app, you'd check a real auth state.
    // For now, we'll just load the data if we were logged in.
    if (isLoggedIn) {
      const storedViewedBooks = localStorage.getItem("litsense_viewed_books");
      if (storedViewedBooks) {
        const books: Book[] = JSON.parse(storedViewedBooks);
        setViewedBooks(books);

        const genreCounts: { [key: string]: number } = {};
        books.forEach(book => {
          if (book.genre) {
            genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
          }
        });
        
        const formattedData: GenreData[] = Object.entries(genreCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setGenreData(formattedData);
      }
    }
  }, [isLoggedIn]);

  const totalBooks = viewedBooks.length;
  const averageRating = totalBooks > 0 ? viewedBooks.reduce((acc, book) => acc + (book.rating || 0), 0) / totalBooks : 0;
  const totalReviews = viewedBooks.reduce((acc, book) => acc + (book.reviews || 0), 0);

  const valueFormatter = (number: number) => `${Intl.NumberFormat('us').format(number).toString()}`;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="p-8 border-2 border-dashed rounded-xl bg-muted/50">
          <BarChart2 className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-6 text-2xl font-bold font-headline">Unlock Your Reading Analytics</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Log in to see personalized stats, your most-read genres, and a deep dive into your literary journey.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login to View Analytics
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Your Reading Analytics</h1>
      
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewed Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">books explored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(2)}</div>
             <p className="text-xs text-muted-foreground">across all viewed books</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{valueFormatter(totalReviews)}</div>
             <p className="text-xs text-muted-foreground">for all viewed books</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            Genre Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {genreData.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                  <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Top Genres</h3>
                  <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                      Your most frequently viewed book genres.
                  </p>
                  <BarChart
                      className="mt-6"
                      data={genreData.slice(0, 5)}
                      index="name"
                      categories={['count']}
                      colors={['blue']}
                      valueFormatter={valueFormatter}
                      yAxisWidth={48}
                  />
              </div>
              <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Genre Breakdown</h3>
                   <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content text-center">
                      A donut chart visualizing the proportion of each genre.
                  </p>
                  <DonutChart
                      className="mt-6"
                      data={genreData}
                      category="count"
                      index="name"
                      valueFormatter={valueFormatter}
                      colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
                  />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Not enough data</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View some books to see your genre analytics here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
