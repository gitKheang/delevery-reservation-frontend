import { useState, useRef } from "react";
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
  Camera,
  X,
  User,
  Send,
  UtensilsCrossed,
  Play,
} from "lucide-react";
import { restaurants, mockReviews, mockStories } from "@/data/mockData";
import type { Review, Story } from "@/data/mockData";
import MenuItemCard from "@/components/MenuItemCard";
import StoryViewer from "@/components/StoryViewer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const { toggleFavorite, isFavorite, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("menu");
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) return <div className="p-5 pt-12">Restaurant not found</div>;

  // Get restaurant stories for the viewer
  const restaurantStories = mockStories.filter(
    (s) => s.restaurantId === restaurant.id && s.userRole === "restaurant",
  );
  const storyCount = restaurantStories.reduce(
    (acc, s) => acc + s.items.length,
    0,
  );

  const liked = restaurant ? isFavorite(restaurant.id) : false;

  // Build merged story for full-screen viewer
  const viewerStory: Story | null =
    restaurantStories.length > 0 && restaurant
      ? {
          id: `merged-${restaurant.id}`,
          userId: restaurantStories[0].userId,
          userName: restaurant.name,
          userAvatar: restaurant.image,
          userRole: "restaurant",
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          items: restaurantStories.flatMap((s) => s.items),
          seen: false,
        }
      : null;

  const handleStoryViewed = (storyId: string) => {
    void storyId;
  };

  const menuCategories = [...new Set(restaurant.menu.map((m) => m.category))];
  const restaurantReviews = reviews.filter(
    (r) => r.restaurantId === restaurant.id,
  );

  const handleAddItem = (item: (typeof restaurant.menu)[0]) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to save favorites");
      navigate("/login");
      return;
    }
    toggleFavorite(restaurant.id);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/restaurant/${restaurant.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on Nham Ey`,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Restaurant link copied");
    } catch {
      toast.error("Unable to share right now");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setReviewPhotos((prev) => [...prev, ...urls].slice(0, 3));
    }
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewComment.trim()) {
      toast.error("Please add a rating and comment");
      return;
    }
    const menuItem = restaurant.menu.find((m) => m.id === selectedMenuItem);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userName: "You",
      userAvatar: "",
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split("T")[0],
      photos: reviewPhotos.length > 0 ? reviewPhotos : undefined,
      menuItemId: menuItem?.id,
      menuItemName: menuItem?.name,
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
    setReviewRating(0);
    setReviewComment("");
    setReviewPhotos([]);
    setSelectedMenuItem("");
    toast.success("Review submitted! Thank you 🎉");
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
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent pointer-events-none" />

        {/* Top controls */}
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
            onClick={handleToggleFavorite}
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
          <button
            onClick={handleShare}
            className="rounded-full bg-card/80 p-2 backdrop-blur-sm"
          >
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
          <div className="flex items-center gap-2">
            {/* Stories button */}
            {storyCount > 0 && (
              <button
                onClick={() => viewerStory && setShowStoryViewer(true)}
                className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 active:scale-95 transition-all"
              >
                <Play size={10} className="fill-primary text-primary" />
                <span className="text-[10px] font-semibold text-primary">
                  {storyCount} {storyCount === 1 ? "Story" : "Stories"}
                </span>
              </button>
            )}
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
                  {restaurantReviews.length} Reviews
                </p>
                <p className="text-xs text-muted-foreground">Overall rating</p>
              </div>
            </div>

            {/* Write Review Button / Form Toggle */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 py-3 text-sm font-semibold text-primary"
            >
              {showReviewForm ? (
                <>
                  <X size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  Write a Review
                </>
              )}
            </button>

            {/* Inline Review Form */}
            {showReviewForm && (
              <div className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
                <h3 className="text-sm font-bold text-card-foreground">
                  Share Your Experience
                </h3>

                {/* Select Food Item (Optional) */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    What did you have? (optional)
                  </label>
                  <select
                    value={selectedMenuItem}
                    onChange={(e) => setSelectedMenuItem(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Select a dish</option>
                    {restaurant.menu.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    Rating
                  </label>
                  <div className="mt-1 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(i + 1)}
                        className="p-0.5"
                      >
                        <Star
                          size={28}
                          className={
                            i < (hoverRating || reviewRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others about your experience..."
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Photo Upload */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    Add Photos (up to 3)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    {reviewPhotos.map((url, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-16 overflow-hidden rounded-xl"
                      >
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setReviewPhotos((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          className="absolute right-0.5 top-0.5 rounded-full bg-black/50 p-0.5"
                        >
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {reviewPhotos.length < 3 && (
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30"
                      >
                        <Camera size={18} className="text-muted-foreground" />
                      </button>
                    )}
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || !reviewComment.trim()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                >
                  <Send size={16} />
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="mt-3 space-y-3">
              {restaurantReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-card p-4 shadow-sm"
                >
                  {/* User Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-card-foreground">
                          {review.userName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
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

                  {/* Food Tag */}
                  {review.menuItemName && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1">
                      <UtensilsCrossed size={10} className="text-primary" />
                      <span className="text-[10px] font-medium text-primary">
                        {review.menuItemName}
                      </span>
                    </div>
                  )}

                  {/* Comment */}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-2.5 flex gap-2">
                      {review.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt=""
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Restaurant Reply */}
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
              {restaurantReviews.length === 0 && (
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

      {/* Full-screen Story Viewer */}
      {showStoryViewer && viewerStory && (
        <StoryViewer
          stories={[viewerStory]}
          initialIndex={0}
          onClose={() => setShowStoryViewer(false)}
          onSeen={handleStoryViewed}
        />
      )}
    </div>
  );
};

export default RestaurantDetailPage;
