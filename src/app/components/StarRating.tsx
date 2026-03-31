import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;      // Current star count (e.g. 4.7)
  size?: number;       // How big should the stars be?
  showValue?: boolean; // Should we show the number (4.7) next to the stars?
  count?: number;      // Optional: How many people reviewed it total?
  interactive?: boolean; // If true, the user can click a star to set the rating
  onRate?: (rating: number) => void;
}

/**
 * --- THE STAR RATING COMPONENT ---
 * This simple little component draws those pretty 5-star ratings 
 * you see everywhere. It can either just "Display" a rating 
 * or "Accept" a new rating from the user.
 */
export function StarRating({
  rating,
  size = 14,
  showValue = true,
  count,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {/* We use [1, 2, 3, 4, 5].map() to draw 5 stars in a row. */}
        {[1, 2, 3, 4, 5].map((star) => {
          
          // Logic: If the star's index is less than or equal to our rating, fill it yellow!
          // We use Math.round() so 4.7 turns into 5 filled stars.
          const isFilled = star <= Math.round(rating);
          
          const starIcon = (
            <Star
              size={size}
              // fill-amber-400: color only the INSIDE of the star
              // text-amber-400: color the OUTLINE of the star
              // text-slate-200: use a light grey for empty stars
              className={`transition-all duration-300 ${
                isFilled
                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.2)]"
                  : "text-slate-200 fill-none"
              }`}
            />
          );

          // If 'interactive' is true, we wrap the star in a real <button> 
          // so users can click/tap it easily.
          return interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onRate?.(star)}
              // hover:scale-125: makes the star bounce when you point at it
              className="cursor-pointer hover:scale-125 active:scale-95 px-0.5 transition-transform"
            >
              {starIcon}
            </button>
          ) : (
            // If it's just for display, we show it as a simple non-clickable span
            <span key={star} className="px-0.5">
              {starIcon}
            </span>
          );
        })}
      </div>
      
      {/* Optional: Show the text value (like "4.8 (12)") next to the stars */}
      {showValue && (
        <span className="text-[0.75rem] text-slate-400 font-bold ml-1">
          {rating > 0 ? rating.toFixed(1) : "No rating"}
          {count !== undefined && <span className="font-medium ml-1">({count})</span>}
        </span>
      )}
    </div>
  );
}