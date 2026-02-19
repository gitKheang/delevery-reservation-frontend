import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Image,
  Video,
  Play,
  Type,
  Clock,
  X,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockStories, restaurants } from "@/data/mockData";
import type { Story, StoryItem } from "@/data/mockData";
import StoryViewer from "@/components/StoryViewer";
import { toast } from "sonner";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import food4 from "@/assets/food-4.jpg";

const sampleImages = [food1, food2, food3, food4];

const StoryManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const restaurant = restaurants.find((r) => r.id === user?.restaurantId);

  const [stories, setStories] = useState<Story[]>(
    mockStories.filter(
      (s) =>
        s.userRole === "restaurant" && s.restaurantId === user?.restaurantId,
    ),
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState<string | null>(null);
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    forceType?: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type =
        forceType ?? (file.type.startsWith("video/") ? "video" : "image");
      setNewMediaUrl(url);
      setNewMediaType(type);
    }
  };

  const handleCreateStory = () => {
    if (!newMediaUrl) {
      toast.error("Please select a photo or video");
      return;
    }

    const newItem: StoryItem = {
      id: `si-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl,
      caption: newCaption || undefined,
      createdAt: new Date().toISOString(),
      duration: newMediaType === "video" ? 15 : undefined,
    };

    // Add to existing story or create new one
    if (stories.length > 0) {
      setStories((prev) =>
        prev.map((s, i) =>
          i === 0 ? { ...s, items: [...s.items, newItem] } : s,
        ),
      );
    } else {
      const newStory: Story = {
        id: `story-${Date.now()}`,
        userId: user?.email ?? "owner",
        userName: restaurant?.name ?? "My Restaurant",
        userAvatar: "",
        userRole: "restaurant",
        restaurantId: user?.restaurantId,
        restaurantName: restaurant?.name,
        items: [newItem],
        seen: false,
      };
      setStories((prev) => [newStory, ...prev]);
    }

    setNewCaption("");
    setNewMediaUrl(null);
    setNewMediaType("image");
    setShowCreateForm(false);
    toast.success("Story published! 🎉");
  };

  const handleDeleteItem = (storyId: string, itemId: string) => {
    setStories((prev) =>
      prev
        .map((s) => {
          if (s.id === storyId) {
            const filtered = s.items.filter((i) => i.id !== itemId);
            return { ...s, items: filtered };
          }
          return s;
        })
        .filter((s) => s.items.length > 0),
    );
    toast.success("Story item deleted");
  };

  const totalItems = stories.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Story Manager</h1>
            <p className="text-xs text-muted-foreground">
              Promote {restaurant?.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          {showCreateForm ? (
            <>
              <X size={14} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={14} />
              New Story
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="mx-5 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Image size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-card-foreground">
              {totalItems}
            </p>
            <p className="text-[10px] text-muted-foreground">Total Stories</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-card-foreground">
              {stories.filter((s) => s.seen).length > 0 ? "Active" : "New"}
            </p>
            <p className="text-[10px] text-muted-foreground">Status</p>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mx-5 mt-4 rounded-2xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-bold text-card-foreground">
            Add New Story
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Share a photo or video to promote your restaurant
          </p>

          {/* Media Preview / Upload */}
          <div className="mt-3">
            {newMediaUrl ? (
              <div className="relative overflow-hidden rounded-xl">
                {newMediaType === "video" ? (
                  <>
                    <video
                      src={newMediaUrl}
                      className="h-48 w-full object-cover"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5">
                      <Video size={10} className="text-white" />
                      <span className="text-[9px] font-semibold text-white">
                        VIDEO
                      </span>
                    </div>
                  </>
                ) : (
                  <img
                    src={newMediaUrl}
                    alt="Preview"
                    className="h-48 w-full object-cover"
                  />
                )}
                <button
                  onClick={() => {
                    setNewMediaUrl(null);
                    setNewMediaType("image");
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="flex flex-1 flex-col items-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-6 transition-colors active:bg-primary/5"
                >
                  <Image size={28} className="text-primary/50" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Upload Photo
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    JPG, PNG, WebP
                  </span>
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex flex-1 flex-col items-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-6 transition-colors active:bg-primary/5"
                >
                  <Video size={28} className="text-primary/50" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Upload Video
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    MP4, WebM (max 30s)
                  </span>
                </button>
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, "image")}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, "video")}
              className="hidden"
            />
          </div>

          {/* Quick Pick */}
          <p className="mt-3 text-[11px] text-muted-foreground">Quick pick:</p>
          <div className="mt-1.5 flex gap-2">
            {sampleImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setNewMediaUrl(img);
                  setNewMediaType("image");
                }}
                className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${
                  newMediaUrl === img ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Caption */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <Type size={14} className="text-muted-foreground" />
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Add a caption to your story..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              maxLength={120}
            />
          </div>

          <button
            onClick={handleCreateStory}
            disabled={!newMediaUrl}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            <Send size={16} />
            Publish Story
          </button>
        </div>
      )}

      {/* Existing Stories */}
      <div className="mt-4 px-5">
        <h2 className="text-sm font-bold text-foreground">Your Stories</h2>
        {stories.length === 0 ? (
          <div className="mt-6 flex flex-col items-center py-8 text-center">
            <div className="rounded-full bg-muted p-6">
              <Image size={32} className="text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              No stories yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share photos and videos to attract more customers
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {stories.map((story) => (
              <div key={story.id} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground">
                    {story.items.length} item{story.items.length > 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => {
                      const idx = stories.indexOf(story);
                      setViewingIndex(idx);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary"
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                  {story.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex-shrink-0 overflow-hidden rounded-xl"
                    >
                      {item.type === "video" ? (
                        <>
                          <video
                            src={item.url}
                            className="h-24 w-20 object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="rounded-full bg-black/50 p-1">
                              <Play size={10} className="text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt=""
                          className="h-24 w-20 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <button
                        onClick={() => handleDeleteItem(story.id, item.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1"
                      >
                        <Trash2 size={10} className="text-white" />
                      </button>
                      {item.caption && (
                        <p className="absolute bottom-1 left-1 right-1 truncate text-[8px] text-white">
                          {item.caption}
                        </p>
                      )}
                      <div className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-black/40 px-1.5 py-0.5">
                        <Clock size={8} className="text-white/70" />
                        <span className="text-[7px] text-white/70">
                          {new Date(item.createdAt).toLocaleTimeString("en", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Viewer */}
      {viewingIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={viewingIndex}
          onClose={() => setViewingIndex(null)}
          onSeen={() => {}}
        />
      )}
    </div>
  );
};

export default StoryManagementPage;
