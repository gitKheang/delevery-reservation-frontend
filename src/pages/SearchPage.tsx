import { useState } from "react";
import { Search, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { restaurants } from "@/data/mockData";
import type { Restaurant } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import DishSearchCard from "@/components/DishSearchCard";
import type { DishSearchResult } from "@/components/DishSearchCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

type SearchMode = "all" | "dishes" | "restaurants";

const dishPopularSearches = ["Sushi", "Burger", "Pizza", "Pasta", "Dessert"];
const restaurantPopularSearches = [
  "Khmer",
  "BBQ",
  "Noodles",
  "Seafood",
  "Street Food",
];
const cuisineShowcaseCount = 12;
const allModeDishPreviewCount = 6;
const allModeRestaurantPreviewCount = 6;
const relatedRestaurantPreviewCount = 4;
const searchModes: { id: SearchMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dishes", label: "Dishes" },
  { id: "restaurants", label: "Restaurants" },
];

const allDishResults: DishSearchResult[] = restaurants.flatMap((restaurant) =>
  restaurant.menu.map((menuItem) => ({
    id: `${restaurant.id}-${menuItem.id}`,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantCuisine: restaurant.cuisine,
    restaurantPriceRange: restaurant.priceRange,
    restaurantDeliveryTime: restaurant.deliveryTime,
    restaurantDistance: restaurant.distance,
    restaurantIsOpen: restaurant.isOpen,
    menuItem,
  })),
);

const buildCuisineShowcaseResults = (cuisine: string): DishSearchResult[] => {
  if (allDishResults.length === 0) return [];

  const cuisineMatches = allDishResults.filter((dish) => {
    const normalizedCuisine = cuisine.toLowerCase();
    return (
      dish.menuItem.name.toLowerCase().includes(normalizedCuisine) ||
      dish.menuItem.category.toLowerCase().includes(normalizedCuisine) ||
      dish.restaurantCuisine.toLowerCase().includes(normalizedCuisine)
    );
  });

  const sourcePool = cuisineMatches.length > 0 ? cuisineMatches : allDishResults;

  return Array.from({ length: cuisineShowcaseCount }, (_, index) => {
    const sourceDish = sourcePool[index % sourcePool.length];
    return {
      ...sourceDish,
      id: `${cuisine.toLowerCase()}-${sourceDish.menuItem.id}-${index}`,
    };
  });
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeMode, setActiveMode] = useState<SearchMode>("all");
  const navigate = useNavigate();
  const { addItem, items, clearCart } = useCart();

  const normalizedQuery = query.trim().toLowerCase();

  const menuItemRestaurantMap = new Map(
    allDishResults.map((dish) => [dish.menuItem.id, dish.restaurantId] as const),
  );

  const activePopularSearches =
    activeMode === "restaurants" ? restaurantPopularSearches : dishPopularSearches;

  const selectedPopularSearch = dishPopularSearches.find(
    (tag) => tag.toLowerCase() === normalizedQuery,
  );

  const dishResults = (() => {
    if (normalizedQuery.length === 0) return allDishResults;

    if (selectedPopularSearch) {
      return buildCuisineShowcaseResults(selectedPopularSearch);
    }

    return allDishResults.filter((dish) => {
      return (
        dish.menuItem.name.toLowerCase().includes(normalizedQuery) ||
        dish.menuItem.category.toLowerCase().includes(normalizedQuery) ||
        dish.restaurantName.toLowerCase().includes(normalizedQuery) ||
        dish.restaurantCuisine.toLowerCase().includes(normalizedQuery)
      );
    });
  })();

  const restaurantResults =
    normalizedQuery.length === 0
      ? restaurants
      : restaurants.filter((restaurant) => {
          return (
            restaurant.name.toLowerCase().includes(normalizedQuery) ||
            restaurant.cuisine.toLowerCase().includes(normalizedQuery) ||
            restaurant.menu.some((menuItem) =>
              menuItem.name.toLowerCase().includes(normalizedQuery),
            )
          );
        });

  const allModeDishResults =
    normalizedQuery.length === 0
      ? dishResults.slice(0, allModeDishPreviewCount)
      : dishResults;

  const allModeRestaurantResults =
    normalizedQuery.length === 0
      ? restaurantResults.slice(0, allModeRestaurantPreviewCount)
      : restaurantResults;

  const relatedRestaurantIds = Array.from(
    new Set(dishResults.map((dish) => dish.restaurantId)),
  );
  const relatedRestaurants = restaurants
    .filter((restaurant) => relatedRestaurantIds.includes(restaurant.id))
    .slice(0, relatedRestaurantPreviewCount);

  const dishSectionTitle =
    normalizedQuery.length === 0 ? "Popular Dishes" : "Dishes";
  const relatedRestaurantSectionTitle =
    normalizedQuery.length === 0
      ? "Popular Restaurants"
      : "Restaurants For These Dishes";

  const totalResults =
    activeMode === "all"
      ? normalizedQuery.length > 0
        ? dishResults.length + restaurantResults.length
        : restaurantResults.length
      : activeMode === "dishes"
        ? dishResults.length
        : restaurantResults.length;

  const handlePopularSearch = (tag: string) => {
    setQuery(tag);
  };

  const handleOpenDish = (dish: DishSearchResult) => {
    navigate(`/restaurant/${dish.restaurantId}?tab=menu&item=${dish.menuItem.id}`);
  };

  const handleOpenRestaurant = (dish: DishSearchResult) => {
    navigate(`/restaurant/${dish.restaurantId}`);
  };

  const handleAddDishToCart = (dish: DishSearchResult) => {
    if (dish.menuItem.status === "sold_out") {
      toast.error("This dish is currently sold out");
      return;
    }

    const cartRestaurantIds = Array.from(
      new Set(
        items
          .map((cartItem) => menuItemRestaurantMap.get(cartItem.menuItem.id))
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const targetRestaurantId = dish.restaurantId;

    if (
      cartRestaurantIds.length > 0 &&
      !cartRestaurantIds.includes(targetRestaurantId)
    ) {
      toast("Your cart has items from another restaurant", {
        description: "Clear cart to add this dish.",
        action: {
          label: "Clear & Add",
          onClick: () => {
            clearCart();
            addItem(dish.menuItem);
            toast.success(`${dish.menuItem.name} added to cart`);
          },
        },
      });
      return;
    }

    addItem(dish.menuItem);
    toast.success(`${dish.menuItem.name} added to cart`);
  };

  const renderRestaurantList = (data: Restaurant[]) =>
    data.map((restaurant) => (
      <RestaurantCard
        key={restaurant.id}
        restaurant={restaurant}
        variant="horizontal"
        resultTypeLabel="Restaurant"
      />
    ));

  const renderDishList = (data: DishSearchResult[]) =>
    data.map((dish, index) => (
      <DishSearchCard
        key={`${dish.id}-${index}`}
        dish={dish}
        onOpenDish={handleOpenDish}
        onOpenRestaurant={handleOpenRestaurant}
        onAddToCart={handleAddDishToCart}
      />
    ));

  return (
    <div className="flex flex-col">
      {/* Search Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 shadow-sm">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
        </div>
        <button
          onClick={() => toast.info("Advanced filters are coming soon")}
          className="rounded-xl bg-card p-2.5 shadow-sm"
        >
          <SlidersHorizontal size={18} className="text-foreground" />
        </button>
      </div>

      {/* Search Type Switch */}
      <div className="px-5 pb-2">
        <div className="inline-flex w-full rounded-xl bg-card p-1 shadow-sm">
          {searchModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeMode === mode.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      {normalizedQuery.length === 0 && activeMode !== "all" && (
        <div className="px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            {activeMode === "dishes" ? "Popular Dishes" : "Popular Restaurants"}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {activePopularSearches.map((tag) => {
              const isActiveTag = normalizedQuery === tag.toLowerCase();

              return (
                <button
                  key={tag}
                  onClick={() => handlePopularSearch(tag)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition-all ${
                    isActiveTag
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-3 px-5 py-3">
        {normalizedQuery.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found
          </p>
        )}

        {normalizedQuery.length > 0 && totalResults === 0 && (
          <div className="rounded-2xl bg-card p-4 text-center shadow-sm">
            <p className="text-sm font-medium text-card-foreground">
              No results found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different keyword or switch result type.
            </p>
          </div>
        )}

        {activeMode === "restaurants" && renderRestaurantList(restaurantResults)}

        {activeMode === "dishes" && (
          <>
            {dishResults.length > 0 && (
              <>
                <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {dishSectionTitle}
                </h3>
                {renderDishList(dishResults)}
              </>
            )}

            {relatedRestaurants.length > 0 && (
              <>
                <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {relatedRestaurantSectionTitle}
                </h3>
                {renderRestaurantList(relatedRestaurants)}
              </>
            )}
          </>
        )}

        {activeMode === "all" && (
          <>
            {allModeDishResults.length > 0 && (
              <>
                <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dishes
                </h3>
                {renderDishList(allModeDishResults)}
              </>
            )}

            {allModeRestaurantResults.length > 0 && (
              <>
                <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Restaurants
                </h3>
                {renderRestaurantList(allModeRestaurantResults)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
