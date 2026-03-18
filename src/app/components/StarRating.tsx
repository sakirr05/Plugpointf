import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  size = 14,
  showValue = true,
  count,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const starEl = (
            <Star
              size={size}
              className={
                star <= Math.round(rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300"
              }
            />
          );

          return interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onRate?.(star)}
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              {starEl}
            </button>
          ) : (
            <span key={star} className="cursor-default">
              {starEl}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-[0.8125rem] text-muted-foreground ml-0.5">
          {rating.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  );
}