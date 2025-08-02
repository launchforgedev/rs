"use client";

import { useState, useMemo, useEffect } from "react";
import type { Book } from "@/types";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

type BookWithYear = Omit<Book, 'coverImage'> & { year: number };

type AuthorTimelineProps = {
  books: BookWithYear[];
  isLoading: boolean;
};

export function AuthorTimeline({ books, isLoading }: AuthorTimelineProps) {
  
  const { minYear, maxYear, yearRange, setYearRange, hasBooks } = useYearRange(books);

  const filteredBooks = useMemo(() => {
    if (!hasBooks) return [];
    return books.filter(book => book.year >= yearRange[0] && book.year <= yearRange[1]);
  }, [books, yearRange, hasBooks]);

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
           <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasBooks) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2 font-headline">More from this Author</h3>
      <Card className="bg-muted/50 p-4 rounded-lg">
        <div className="mb-4">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
            </div>
            <Slider
                min={minYear}
                max={maxYear}
                step={1}
                value={yearRange}
                onValueChange={handleSliderChange}
                aria-label="Year Range Slider"
            />
        </div>
        {filteredBooks.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredBooks.map(book => (
              <div key={`${book.title}-${book.author}`} className="text-sm p-2 rounded-md hover:bg-muted">
                <h4 className="font-semibold truncate" title={book.title}>{book.title}</h4>
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


function useYearRange(books: BookWithYear[]) {
  const hasBooks = books.length > 0;

  const { minYear, maxYear } = useMemo(() => {
    if (!hasBooks) return { minYear: 1980, maxYear: new Date().getFullYear() };
    const years = books.map(book => book.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return { minYear: min, maxYear: max };
  }, [books, hasBooks]);

  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);

  useEffect(() => {
    setYearRange([minYear, maxYear]);
  }, [minYear, maxYear]);

  return { minYear, maxYear, yearRange, setYearRange, hasBooks };
}
