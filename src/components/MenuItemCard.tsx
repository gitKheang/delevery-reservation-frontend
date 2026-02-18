import { Plus, Clock, Star } from "lucide-react";
import type { MenuItem } from "@/data/mockData";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const isSoldOut = item.status === "sold_out";
  const isTimeBased = item.status === "time_based";

  return (
    <div
      className={`flex gap-3 rounded-2xl bg-card p-3 shadow-sm ${
        isSoldOut ? "opacity-50" : ""
      }`}
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <span className="text-[10px] font-bold text-primary-foreground">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-card-foreground">
              {item.name}
            </h4>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star size={10} className="fill-primary text-primary" />
              {item.rating}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted-foreground">
            {item.description}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
            {isTimeBased && (
              <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock size={10} />
                {item.availableTime}
              </span>
            )}
          </div>
          {!isSoldOut && (
            <button
              onClick={() => onAdd(item)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
