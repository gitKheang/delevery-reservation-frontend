import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Star,
  Clock,
  MapPin,
  Phone,
  Share2,
  Users,
  Navigation,
  MessageSquare,
} from "lucide-react";
import { restaurants, mockReviews } from "@/data/mockData";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const [activeTab, setActiveTab] = useState("menu");
  const [liked, setLiked] = useState(false);

  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) return <div className="p-5 pt-12">Restaurant not found</div>;

  const menuCategories = [...new Set(restaurant.menu.map((m) => m.category))];

  const handleAddItem = (item: (typeof restaurant.menu)[0]) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-56 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute left-4 top-10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-card/80 p-2 backdrop-blur-sm"
          >
            <ArrowLeft size={20} className="text-card-foreground" />
          </button>
        </div>
        <div className="absolute right-4 top-10 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="rounded-full bg-card/80 p-2 backdrop-blur-sm"
          >
            <Heart
              size={20}
              className={
                liked
                  ? "fill-destructive text-destructive"
                  : "text-card-foreground"
              }
            />
          </button>
          <button className="rounded-full bg-card/80 p-2 backdrop-blur-sm">
            <Share2 size={20} className="text-card-foreground" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="relative -mt-4 rounded-t-3xl bg-background px-5 pt-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {restaurant.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {restaurant.cuisine} · {restaurant.priceRange}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              restaurant.isOpen
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {restaurant.description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-semibold text-foreground">
              {restaurant.rating}
            </span>
            ({restaurant.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {restaurant.distance}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/restaurant/${restaurant.id}/reserve`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
          >
            <Users size={16} />
            Reserve Table
          </button>
          <a
            href={`tel:${restaurant.phone}`}
            className="flex items-center justify-center rounded-xl bg-card px-4 py-3 shadow-sm"
          >
            <Phone size={18} className="text-foreground" />
          </a>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-4 border-b border-border">
          {["menu", "reviews", "info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        {activeTab === "menu" && (
          <div className="mt-4 pb-4">
            {menuCategories.map((category) => (
              <div key={category} className="mb-4">
                <h3 className="mb-2 text-sm font-bold capitalize text-foreground">
                  {category}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {restaurant.menu
                    .filter((m) => m.category === category)
                    .map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAdd={handleAddItem}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-4 pb-4">
            {/* Review Summary */}
            <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {restaurant.rating}
                </p>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.round(restaurant.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {restaurant.reviewCount} Reviews
                </p>
                <p className="text-xs text-muted-foreground">Overall rating</p>
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => navigate("/reviews")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 py-3 text-sm font-semibold text-primary"
            >
              <MessageSquare size={16} />
              Write a Review
            </button>

            {/* Reviews List */}
            <div className="mt-3 space-y-3">
              {mockReviews
                .filter((r) => r.restaurantId === restaurant.id)
                .map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                    {review.reply && (
                      <div className="mt-3 rounded-xl bg-muted/50 p-3">
                        <p className="text-[10px] font-medium text-muted-foreground">
                          Restaurant Reply
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {review.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              {mockReviews.filter((r) => r.restaurantId === restaurant.id)
                .length === 0 && (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No reviews yet. Be the first to write one!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="mt-4 space-y-4 pb-4">
            {/* Map Placeholder */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="relative flex h-40 items-center justify-center bg-muted">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <MapPin size={28} className="text-primary" />
                  <p className="text-xs font-medium">{restaurant.address}</p>
                </div>
                {/* Map grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`,
                    "_blank",
                  );
                }}
                className="flex w-full items-center justify-center gap-2 bg-card py-3 text-sm font-semibold text-primary"
              >
                <Navigation size={14} />
                Get Directions
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                <span className="text-foreground">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-foreground">{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-foreground">
                  Mon-Sun: 10:00 AM - 10:00 PM
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart FAB */}
      {itemCount > 0 && (
        <button
          onClick={() => navigate("/cart")}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 shadow-lg transition-all active:scale-95"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-bold text-primary">
            {itemCount}
          </span>
          <span className="text-sm font-semibold text-primary-foreground">
            View Cart
          </span>
        </button>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
