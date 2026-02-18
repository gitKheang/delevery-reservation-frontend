import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Heart,
  MapPin,
  CreditCard,
  Gift,
  Star,
  ChevronRight,
  LogOut,
  Flame,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: MapPin, label: "Addresses", path: "/settings/addresses" },
    { icon: CreditCard, label: "Payment Methods", path: "/settings/payment" },
    { icon: Gift, label: "Coupons & Offers", path: "/coupons" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="px-5 pb-5 pt-12">
        <h1 className="text-lg font-bold text-foreground">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="mx-5 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <User size={28} className="text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-card-foreground">
            {user?.name || "Guest User"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {user?.email || "Sign in to access all features"}
          </p>
          {user?.phone && (
            <p className="text-xs text-muted-foreground">{user.phone}</p>
          )}
        </div>
        <button
          onClick={() => navigate("/settings/edit-profile")}
          className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
        >
          Edit
        </button>
      </div>

      {/* Loyalty Card */}
      <div className="mx-5 mt-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-primary-foreground/70">Loyalty Points</p>
            <p className="mt-0.5 text-2xl font-bold text-primary-foreground">
              {user?.loyaltyPoints || 0}
            </p>
          </div>
          <div className="rounded-xl bg-white/20 px-3 py-1.5">
            <p className="text-xs font-medium text-primary-foreground">
              <Trophy size={12} className="mb-0.5 mr-1 inline" />
              {user?.tier || "Bronze"} Member
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/80"
              style={{
                width: `${Math.min(100, ((user?.loyaltyPoints || 0) / 5000) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-[10px] text-primary-foreground/70">
            {5000 - (user?.loyaltyPoints || 0)} points to Platinum
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="mx-5 mt-3 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
          <Flame size={24} className="text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-card-foreground">
              {user?.streak || 0}-Day Streak
            </p>
            <span className="text-lg">🔥</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {(user?.streak || 0) >= 5
              ? "Amazing! You've unlocked a 15% discount!"
              : `${5 - (user?.streak || 0)} more days to unlock a bonus coupon`}
          </p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-6 w-1.5 rounded-full ${
                i < (user?.streak || 0) ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-5 mt-4 overflow-hidden rounded-2xl bg-card shadow-sm">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 ${
              index < menuItems.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <item.icon size={18} className="text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-card-foreground">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-5 mt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 py-3.5 text-sm font-medium text-destructive"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
