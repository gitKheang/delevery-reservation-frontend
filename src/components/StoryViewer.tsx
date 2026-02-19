import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  User,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import type { Story } from "@/data/mockData";

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onSeen: (storyId: string) => void;
}

const IMAGE_DURATION = 5000; // 5 seconds per image story
const VIDEO_MAX_DURATION = 30000; // max 30s for video

const StoryViewer = ({
  stories,
  initialIndex,
  onClose,
  onSeen,
}: StoryViewerProps) => {
  const navigate = useNavigate();
  const [storyIndex, setStoryIndex] = useState(initialIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[storyIndex];
  const currentItem = currentStory?.items[itemIndex];
  const isVideo = currentItem?.type === "video";
  const activeDuration = isVideo
    ? Math.min(
        (videoDuration ?? currentItem?.duration ?? 15) * 1000,
        VIDEO_MAX_DURATION,
      )
    : IMAGE_DURATION;

  const goToNextItem = useCallback(() => {
    if (!currentStory) return;
    if (itemIndex < currentStory.items.length - 1) {
      setItemIndex((prev) => prev + 1);
      setProgress(0);
      setVideoDuration(null);
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setItemIndex(0);
      setProgress(0);
      setVideoDuration(null);
    } else {
      onClose();
    }
  }, [currentStory, itemIndex, storyIndex, stories.length, onClose]);

  const goToPrevItem = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
      setProgress(0);
      setVideoDuration(null);
    } else if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1];
      setStoryIndex((prev) => prev - 1);
      setItemIndex(prevStory.items.length - 1);
      setProgress(0);
      setVideoDuration(null);
    }
  }, [itemIndex, storyIndex, stories]);

  // Mark story as seen
  useEffect(() => {
    if (currentStory && !currentStory.seen) {
      onSeen(currentStory.id);
    }
  }, [currentStory, onSeen]);

  // Progress timer
  useEffect(() => {
    if (paused) return;

    // For video, let the video element drive progress via timeupdate
    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          setProgress(pct);
        }
      };
      const handleEnded = () => {
        goToNextItem();
      };
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      };
    }

    // For images, use interval timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (activeDuration / 50);
        if (next >= 100) {
          goToNextItem();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [paused, goToNextItem, isVideo, activeDuration]);

  // Handle video play/pause
  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (paused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [paused, isVideo, storyIndex, itemIndex]);

  if (!currentStory || !currentItem) return null;

  const fallbackRestaurantId =
    currentStory.userRole === "restaurant"
      ? restaurants.find((r) => r.name === currentStory.userName)?.id
      : undefined;
  const restaurantId = currentStory.restaurantId ?? fallbackRestaurantId;
  const canOpenRestaurant =
    currentStory.userRole === "restaurant" && Boolean(restaurantId);

  const handleProfileClick = () => {
    if (!restaurantId) return;
    onClose();
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Mobile container — constrained to max phone width */}
      <div className="relative h-full w-full max-w-[430px] mx-auto overflow-hidden">
        {/* Background Media */}
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentItem.url}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted={muted}
              onLoadedMetadata={(e) => {
                setVideoDuration((e.target as HTMLVideoElement).duration);
              }}
            />
          ) : (
            <img
              src={currentItem.url}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </div>

        {/* Progress Bars */}
        <div className="absolute left-0 right-0 top-0 z-10 flex gap-1 px-3 pt-[env(safe-area-inset-top,12px)]">
          {currentStory.items.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width:
                    i < itemIndex
                      ? "100%"
                      : i === itemIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute left-0 right-0 top-5 z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,8px)]">
          {canOpenRestaurant ? (
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2.5 text-left"
              aria-label={`Open ${currentStory.userName} restaurant page`}
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white/60 bg-muted">
                {currentStory.items[0]?.url ? (
                  <img
                    src={currentStory.items[0].url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : currentStory.userRole === "restaurant" ? (
                  <Store size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {currentStory.userName}
                </p>
                <p className="text-[10px] text-white/70">
                  {currentStory.userRole === "restaurant"
                    ? "Restaurant"
                    : "User"}{" "}
                  ·{" "}
                  {new Date(currentItem.createdAt).toLocaleTimeString("en", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white/60 bg-muted">
                {currentStory.items[0]?.url ? (
                  <img
                    src={currentStory.items[0].url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : currentStory.userRole === "restaurant" ? (
                  <Store size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {currentStory.userName}
                </p>
                <p className="text-[10px] text-white/70">
                  {currentStory.userRole === "restaurant"
                    ? "Restaurant"
                    : "User"}{" "}
                  ·{" "}
                  {new Date(currentItem.createdAt).toLocaleTimeString("en", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {isVideo && (
              <button
                onClick={() => setMuted(!muted)}
                className="rounded-full bg-black/30 p-2 backdrop-blur-sm"
              >
                {muted ? (
                  <VolumeX size={16} className="text-white" />
                ) : (
                  <Volume2 size={16} className="text-white" />
                )}
              </button>
            )}
            <button
              onClick={() => setPaused(!paused)}
              className="rounded-full bg-black/30 p-2 backdrop-blur-sm"
            >
              {paused ? (
                <Play size={16} className="text-white" />
              ) : (
                <Pause size={16} className="text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-black/30 p-2 backdrop-blur-sm"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Touch Areas for navigation */}
        <div className="absolute inset-0 z-[5] flex">
          <button
            onClick={goToPrevItem}
            className="h-full w-1/3"
            aria-label="Previous"
          />
          <button
            onClick={() => setPaused(!paused)}
            className="h-full w-1/3"
            aria-label="Pause"
          />
          <button
            onClick={goToNextItem}
            className="h-full w-1/3"
            aria-label="Next"
          />
        </div>

        {/* Navigation Arrows (desktop fallback) */}
        {(storyIndex > 0 || itemIndex > 0) && (
          <button
            onClick={goToPrevItem}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-sm md:flex"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}
        {(storyIndex < stories.length - 1 ||
          itemIndex < currentStory.items.length - 1) && (
          <button
            onClick={goToNextItem}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-sm md:flex"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        )}

        {/* Caption */}
        {currentItem.caption && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-[env(safe-area-inset-bottom,32px)]">
            <div className="rounded-2xl bg-black/40 px-4 py-3 backdrop-blur-sm">
              <p className="text-center text-sm leading-relaxed text-white">
                {currentItem.caption}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* end mobile container */}
    </div>
  );
};

export default StoryViewer;
