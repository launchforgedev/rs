
"use client";

import type { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

type BookListItemProps = {
  book: Book;
  onSelect: () => void;
};

export function BookListItem({ book, onSelect }: BookListItemProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
            <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{book.genre}</Badge>
                    <StarRating rating={book.rating} />
                </div>
                <h3 className="font-headline font-bold text-xl leading-tight">
                    {book.title}
                </h3>
                <p className="text-md text-muted-foreground mb-2">{book.author}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{book.summary}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
}
