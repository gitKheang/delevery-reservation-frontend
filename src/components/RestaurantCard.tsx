import { Star, Clock, MapPin } from "lucide-react";
import type { Restaurant } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "horizontal" | "vertical";
}

const RestaurantCard = ({
  restaurant,
  variant = "vertical",
}: RestaurantCardProps) => {
  const navigate = useNavigate();

  if (variant === "horizontal") {
    return (
      <button
        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
        className="flex w-full gap-3 rounded-2xl bg-card p-3 shadow-sm transition-all active:scale-[0.98]"
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="flex flex-1 flex-col items-start text-left">
          <div className="flex w-full items-center justify-between">
            <h3 className="font-semibold text-card-foreground">
              {restaurant.name}
            </h3>
            {!restaurant.isOpen && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                Closed
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {restaurant.cuisine} · {restaurant.priceRange}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-primary text-primary" />
              <span className="font-medium text-foreground">
                {restaurant.rating}
              </span>
              <span>({restaurant.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {restaurant.deliveryTime}
            </span>
          </div>
          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {restaurant.distance}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-card shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-28 w-full object-cover"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-card-foreground">
              Closed
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
          <Star size={10} className="fill-primary text-primary" />
          {restaurant.rating}
        </div>
      </div>
      <div className="p-3 text-left">
        <h3 className="text-sm font-semibold text-card-foreground">
          {restaurant.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {restaurant.cuisine} · {restaurant.deliveryTime}
        </p>
      </div>
    </button>
  );
};

export default RestaurantCard;
