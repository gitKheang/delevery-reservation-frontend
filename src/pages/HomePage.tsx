import { useState, useRef } from "react";
import { Search, Bell, MapPin, ChevronRight } from "lucide-react";
import { restaurants, categories, mockPromotions } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import StoriesBar from "@/components/StoriesBar";
import { useNavigate } from "react-router-dom";
import { useAddress } from "@/context/AddressContext";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePromo, setActivePromo] = useState(0);
  const navigate = useNavigate();
  const { selectedAddress } = useAddress();
  const promoRef = useRef<HTMLDivElement>(null);

  const handlePromoScroll = () => {
    const container = promoRef.current;
    if (!container) return;

    const firstChild = container.children[0] as HTMLElement | undefined;
    const secondChild = container.children[1] as HTMLElement | undefined;
    if (!firstChild) return;

    const fallbackGap = 12; // gap-3
    const step = secondChild
      ? secondChild.offsetLeft - firstChild.offsetLeft
      : firstChild.offsetWidth + fallbackGap;
    if (step <= 0) return;

    const nextIndex = Math.round(container.scrollLeft / step);
    const clampedIndex = Math.max(
      0,
      Math.min(mockPromotions.length - 1, nextIndex),
    );

    if (clampedIndex !== activePromo) {
      setActivePromo(clampedIndex);
    }
  };

  const filteredRestaurants =
    activeCategory === "all"
      ? restaurants
      : restaurants.filter((r) =>
          r.cuisine.toLowerCase().includes(activeCategory),
        );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary px-5 pb-6 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-foreground/70">
              Deliver to
            </p>
            <button
              onClick={() => navigate("/settings/addresses?select=1&from=/")}
              className="flex items-center gap-1 text-sm font-semibold text-primary-foreground"
            >
              <MapPin size={14} />
              <span className="max-w-[200px] truncate">
                {selectedAddress?.addressLine ?? "Choose delivery address"}
              </span>
              <ChevronRight size={14} />
            </button>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="relative rounded-full bg-primary-foreground/15 p-2.5"
          >
            <Bell size={20} className="text-primary-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => navigate("/search")}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl bg-primary-foreground/15 px-4 py-3"
        >
          <Search size={18} className="text-primary-foreground/60" />
          <span className="text-sm text-primary-foreground/60">
            Search restaurants or dishes...
          </span>
        </button>
      </div>

      {/* Stories from followed restaurants */}
      <StoriesBar />

      {/* Promo Carousel */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Special Offers</h2>
          <button
            onClick={() => navigate("/coupons")}
            className="text-xs font-medium text-primary"
          >
            View All
          </button>
        </div>
        <div className="relative mt-3">
          <div
            ref={promoRef}
            onScroll={handlePromoScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-hide"
          >
            {mockPromotions.map((promo, index) => {
              const emojis = ["💝", "🍰", "🎁", "🔥"];
              const gradients = [
                "from-accent to-primary",
                "from-red-600 to-primary",
                "from-primary to-yellow-500",
                "from-accent to-red-700",
              ];
              return (
                <div
                  key={promo.id}
                  className={`w-full flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-gradient-to-r ${gradients[index % gradients.length]} p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-primary-foreground/80">
                        🔥 Limited Time
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold text-primary-foreground">
                        {promo.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-primary-foreground/80">
                        {promo.description}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Use: {promo.code}
                      </span>
                    </div>
                    <span className="text-4xl">
                      {emojis[index % emojis.length]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Dots */}
          <div className="mt-2 flex justify-center gap-1.5">
            {mockPromotions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActivePromo(i);
                  const container = promoRef.current;
                  const target = container?.children[i] as
                    | HTMLElement
                    | undefined;
                  if (!container || !target) return;
                  container.scrollTo({
                    left: target.offsetLeft,
                    behavior: "smooth",
                  });
                }}
                className={`h-1.5 rounded-full transition-all ${
                  activePromo === i
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5 px-5">
        <h2 className="text-base font-bold text-foreground">Categories</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground shadow-sm"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Featured</h2>
          <button
            onClick={() => navigate("/search")}
            className="text-xs font-medium text-primary"
          >
            See all
          </button>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {restaurants
            .filter((r) => r.isOpen)
            .map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
        </div>
      </div>

      {/* Nearby */}
      <div className="mt-6 px-5 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Nearby Restaurants
          </h2>
          <button
            onClick={() => navigate("/search")}
            className="text-xs font-medium text-primary"
          >
            See all
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {filteredRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} variant="horizontal" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
