"use client";

import { useState, useMemo } from "react";
import type { Book } from "@/types";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type BookWithYear = Book & { year: number };

type AuthorTimelineProps = {
  books: BookWithYear[];
  isLoading: boolean;
};

export function AuthorTimeline({ books, isLoading }: AuthorTimelineProps) {
  const [yearRange, setYearRange] = useState<[number, number]>([0, 9999]);

  const { minYear, maxYear } = useMemo(() => {
    if (books.length === 0) return { minYear: 1980, maxYear: new Date().getFullYear() };
    const years = books.map(book => book.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return { minYear: min, maxYear: max };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => book.year >= yearRange[0] && book.year <= yearRange[1]);
  }, [books, yearRange]);

  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      setYearRange([value[0], value[1]]);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-4 font-headline">More from this Author</h3>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-36 w-24 mx-auto rounded-md" />
                <Skeleton className="h-4 w-20 mx-auto mt-2" />
                <Skeleton className="h-3 w-16 mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (books.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2 font-headline">More from this Author</h3>
      <Card className="bg-muted/50 p-4 rounded-lg">
        <div className="mb-4">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
                <span>{yearRange[0] === 0 ? minYear : yearRange[0]}</span>
                <span>{yearRange[1] === 9999 ? maxYear : yearRange[1]}</span>
            </div>
            <Slider
                min={minYear}
                max={maxYear}
                step={1}
                defaultValue={[minYear, maxYear]}
                onValueCommit={handleSliderChange}
                aria-label="Year Range Slider"
            />
        </div>
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredBooks.map(book => (
              <div key={`${book.title}-${book.author}`} className="text-center">
                <Image src={book.coverImage} alt={book.title} width={100} height={150} className="mx-auto rounded-md shadow-md bg-muted object-cover h-36 w-auto" data-ai-hint={book.dataAiHint} />
                <h4 className="text-sm font-bold mt-2 truncate" title={book.title}>{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center text-muted-foreground py-8">No books found in the selected year range.</p>
        )}
      </Card>
    </div>
  );
}
