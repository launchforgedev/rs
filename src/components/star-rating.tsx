import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1 text-accent", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-current" />
      ))}
      {halfStar && <StarHalf className="h-5 w-5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
      ))}
       <span className="ml-2 text-sm text-muted-foreground font-bold">{rating.toFixed(1)}</span>
    </div>
  );
}
