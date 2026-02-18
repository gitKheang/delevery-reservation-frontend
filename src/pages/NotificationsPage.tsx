import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  ShoppingBag,
  Calendar,
  Tag,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockNotifications } from "@/data/mockData";
import type { AppNotification } from "@/data/mockData";

const iconMap = {
  order: ShoppingBag,
  reservation: Calendar,
  promo: Tag,
  system: Settings2,
};

const colorMap = {
  order: "bg-primary/10 text-primary",
  reservation: "bg-blue-100 text-blue-600",
  promo: "bg-green-100 text-green-600",
  system: "bg-amber-100 text-amber-600",
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-medium text-primary"
        >
          Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 px-5">
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type];
          return (
            <div
              key={notif.id}
              className={`flex gap-3 rounded-2xl p-4 ${
                notif.read ? "bg-card" : "bg-primary/5 border border-primary/10"
              } shadow-sm`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorMap[notif.type]}`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3
                    className={`text-sm font-semibold ${
                      notif.read ? "text-card-foreground" : "text-foreground"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {notif.message}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {formatTime(notif.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Bell size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            No notifications
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re all caught up!
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
