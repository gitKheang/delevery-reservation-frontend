import { ArrowLeft, Heart, Star, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const favoriteRestaurants = restaurants.filter((r) =>
    user?.favorites?.includes(r.id),
  );

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Favorites</h1>
      </div>

      {favoriteRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-20">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            No favorites yet
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Heart restaurants you love to save them here
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-3 px-5">
          {favoriteRestaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/restaurant/${r.id}`)}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-sm"
            >
              <img
                src={r.image}
                alt={r.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-card-foreground">
                    {r.name}
                  </h3>
                  <Heart
                    size={16}
                    className="fill-destructive text-destructive"
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.cuisine} · {r.priceRange}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">
                      {r.rating}
                    </span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={12} />
                    {r.deliveryTime}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={12} />
                    {r.distance}
                  </span>
                </div>
                <span
                  className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    r.isOpen
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {r.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
