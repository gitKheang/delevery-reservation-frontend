import { useState } from "react";
import { ArrowLeft, Star, PenLine, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockReviews, restaurants } from "@/data/mockData";
import type { Review } from "@/data/mockData";
import { toast } from "sonner";

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmitReview = () => {
    if (!selectedRestaurantId || newRating === 0 || !newComment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const restaurant = restaurants.find((r) => r.id === selectedRestaurantId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      restaurantId: selectedRestaurantId,
      restaurantName: restaurant?.name ?? "Unknown",
      userName: "You",
      userAvatar: "",
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
    setNewRating(0);
    setNewComment("");
    setSelectedRestaurantId("");
    toast.success("Review submitted! Thank you 🎉");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">My Reviews</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          {showForm ? (
            <>
              <X size={14} />
              Cancel
            </>
          ) : (
            <>
              <PenLine size={14} />
              Write
            </>
          )}
        </button>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div className="mx-5 mb-4 rounded-2xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-bold text-card-foreground">
            Write a Review
          </h3>

          {/* Restaurant Select */}
          <div className="mt-3">
            <label className="text-xs font-medium text-muted-foreground">
              Restaurant
            </label>
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
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
                  onClick={() => setNewRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      i < (hoverRating || newRating)
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
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            onClick={handleSubmitReview}
            disabled={
              !selectedRestaurantId || newRating === 0 || !newComment.trim()
            }
            className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mx-5 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">
            {avgRating.toFixed(1)}
          </p>
          <div className="mt-0.5 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(avgRating)
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
            {reviews.length} Reviews
          </p>
          <p className="text-xs text-muted-foreground">Your average rating</p>
        </div>
      </div>

      {/* Review List */}
      <div className="mt-4 space-y-3 px-5">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  {review.restaurantName}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {new Date(review.date).toLocaleDateString("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
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
      </div>
    </div>
  );
};

export default ReviewsPage;
