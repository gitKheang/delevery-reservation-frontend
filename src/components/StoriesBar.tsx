import { useState } from "react";
import { Store, Play } from "lucide-react";
import type { Story } from "@/data/mockData";
import { mockStories } from "@/data/mockData";
import StoryViewer from "@/components/StoryViewer";
import { useAuth } from "@/context/AuthContext";

const StoriesBar = () => {
  const { isFavorite } = useAuth();
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [viewerStories, setViewerStories] = useState<Story[] | null>(null);

  // Only show stories from restaurants the user follows
  const followedStories = stories.filter((s) => {
    if (s.userRole !== "restaurant" || !s.restaurantId) return false;
    return isFavorite(s.restaurantId);
  });

  const sortedStories = [...followedStories].sort((a, b) => {
    if (a.seen !== b.seen) return a.seen ? 1 : -1;
    return (
      new Date(b.items[0]?.createdAt).getTime() -
      new Date(a.items[0]?.createdAt).getTime()
    );
  });

  const handleStoryClick = (index: number) => {
    setViewerStories(sortedStories);
    setViewingIndex(index);
  };

  const handleStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, seen: true } : s)),
    );
  };

  // Don't render if no followed stories
  if (sortedStories.length === 0) return null;

  return (
    <>
      <div className="px-5 pt-4">
        <h2 className="text-sm font-bold text-foreground">
          Stories from restaurants you follow
        </h2>
        <div className="mt-2 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {sortedStories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => handleStoryClick(index)}
              className="flex flex-shrink-0 flex-col items-center gap-1"
            >
              <div
                className={`relative rounded-full p-[2.5px] ${
                  story.seen
                    ? "bg-muted"
                    : "bg-gradient-to-br from-accent via-primary to-yellow-400"
                }`}
              >
                <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted">
                  {story.items[0]?.url ? (
                    story.items[0]?.type === "video" ? (
                      <video
                        src={story.items[0].url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={story.items[0].url}
                        alt={story.userName}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <Store size={22} className="text-muted-foreground" />
                  )}
                </div>
                {story.items.some((i) => i.type === "video") && (
                  <div className="absolute -bottom-0.5 right-0 rounded-full bg-accent p-[3px]">
                    <Play size={8} className="fill-white text-white" />
                  </div>
                )}
              </div>
              <span
                className={`w-16 truncate text-center text-[10px] font-medium ${
                  story.seen ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {story.userName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer - Full screen mobile-optimized */}
      {viewingIndex !== null && (
        <StoryViewer
          stories={viewerStories ?? sortedStories}
          initialIndex={viewingIndex}
          onClose={() => {
            setViewingIndex(null);
            setViewerStories(null);
          }}
          onSeen={handleStoryViewed}
        />
      )}
    </>
  );
};

export default StoriesBar;
