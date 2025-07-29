
import Image from "next/image";
import type { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";

type BookCardProps = {
  book: Book;
  onSelect: () => void;
};

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col group"
      onClick={onSelect}
    >
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative w-full h-[250px] sm:h-[200px] md:h-[250px] overflow-hidden">
           <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-cover bg-muted transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={book.dataAiHint}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-headline font-bold text-lg truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{book.summary}</p>
          <div className="mt-4">
            <StarRating rating={book.rating} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    