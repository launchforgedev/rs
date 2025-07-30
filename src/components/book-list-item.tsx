
"use client";

import type { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";


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
            {book.coverImage && (
              <div className="w-20 h-28 relative flex-shrink-0">
                  <Image 
                      src={book.coverImage} 
                      alt={`Cover for ${book.title}`} 
                      fill 
                      sizes="80px"
                      className="object-cover rounded-md bg-muted"
                      data-ai-hint={book.dataAiHint}
                  />
              </div>
            )}
            <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="secondary">{book.genre}</Badge>
                    <StarRating rating={book.rating} />
                </div>
                <h3 className="font-headline font-bold text-xl leading-tight truncate" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-md text-muted-foreground mb-2 truncate">{book.author}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{book.summary}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
