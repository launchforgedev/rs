
"use client";

import Image from "next/image";
import type { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-1/4 aspect-[2/3] sm:aspect-auto overflow-hidden rounded-md flex-shrink-0">
                <Image
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover bg-muted transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={book.dataAiHint}
                />
            </div>
            <div className="flex flex-col flex-grow">
                <Badge variant="secondary" className="w-fit mb-2">{book.genre}</Badge>
                <h3 className="font-headline font-bold text-xl leading-tight">
                    {book.title}
                </h3>
                <p className="text-md text-muted-foreground mb-2">{book.author}</p>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">{book.summary}</p>
                <div className="mt-auto">
                    <StarRating rating={book.rating} />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    