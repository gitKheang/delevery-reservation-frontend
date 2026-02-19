import { Clock, MapPin, Plus, Star, Store } from "lucide-react";
import type { MenuItem } from "@/data/mockData";

export interface DishSearchResult {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantPriceRange: string;
  restaurantDeliveryTime: string;
  restaurantDistance: string;
  restaurantIsOpen: boolean;
  menuItem: MenuItem;
}

interface DishSearchCardProps {
  dish: DishSearchResult;
  onOpenDish: (dish: DishSearchResult) => void;
  onOpenRestaurant: (dish: DishSearchResult) => void;
  onAddToCart: (dish: DishSearchResult) => void;
}

const DishSearchCard = ({
  dish,
  onOpenDish,
  onOpenRestaurant,
  onAddToCart,
}: DishSearchCardProps) => {
  const isSoldOut = dish.menuItem.status === "sold_out";
  const isTimeBased = dish.menuItem.status === "time_based";

  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm">
      <button
        onClick={() => onOpenDish(dish)}
        className="flex w-full gap-3 text-left"
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={dish.menuItem.image}
            alt={dish.menuItem.name}
            className="h-full w-full object-cover"
          />
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/65">
              <span className="text-[10px] font-bold text-primary-foreground">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-start">
          <div className="flex w-full items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-card-foreground">
              {dish.menuItem.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Dish
              </span>
              {!dish.restaurantIsOpen && (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                  Closed
                </span>
              )}
            </div>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {dish.restaurantName}
          </p>
          <p className="text-xs text-muted-foreground">
            {dish.restaurantCuisine} · {dish.restaurantPriceRange}
          </p>

          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-primary text-primary" />
              <span className="font-medium text-foreground">
                {dish.menuItem.rating}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {dish.restaurantDeliveryTime}
            </span>
          </div>

          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {dish.restaurantDistance}
          </span>

          {isTimeBased && (
            <span className="mt-1 text-[10px] text-muted-foreground">
              Available: {dish.menuItem.availableTime}
            </span>
          )}
        </div>
      </button>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold text-primary">
          ${dish.menuItem.price.toFixed(2)}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenRestaurant(dish)}
            className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all active:scale-95"
          >
            <Store size={12} />
            Restaurant
          </button>

          <button
            onClick={() => onAddToCart(dish)}
            disabled={isSoldOut}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={12} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishSearchCard;
