import { useState } from "react";
import { Search, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/RestaurantCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results =
    query.length > 0
      ? restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(query.toLowerCase()) ||
            r.menu.some((m) =>
              m.name.toLowerCase().includes(query.toLowerCase()),
            ),
        )
      : restaurants;

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

      {/* Popular Searches */}
      {query.length === 0 && (
        <div className="px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Popular Searches
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Sushi", "Burger", "Thai", "Pizza", "Pasta", "Dessert"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full bg-card px-3 py-1.5 text-xs font-medium text-card-foreground shadow-sm"
                >
                  {tag}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex flex-col gap-3 px-5 py-3">
        {query.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
        )}
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} variant="horizontal" />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
