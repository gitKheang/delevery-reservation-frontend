import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Star,
  Bell,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import {
  mockPlatformStats,
  mockSystemEvents,
  mockRestaurantApplications,
} from "@/data/mockData";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const stats = mockPlatformStats;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: "+12%",
    },
    {
      label: "Restaurants",
      value: String(stats.totalRestaurants),
      icon: Store,
      color: "bg-amber-100 text-amber-600",
      change: "+5",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "bg-emerald-100 text-emerald-600",
      change: "+8%",
    },
    {
      label: "Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
      change: "+15%",
    },
  ];

  const pendingApps = mockRestaurantApplications.filter(
    (a) => a.status === "pending",
  );
  const upcomingEvents = mockSystemEvents.filter(
    (e) => e.status === "scheduled",
  );

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 pb-6 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Admin Panel</p>
            <h1 className="text-lg font-bold text-white">
              Nham Ey Platform 🇰🇭
            </h1>
          </div>
          <button
            onClick={() => navigate("/admin/notifications")}
            className="relative rounded-full bg-white/15 p-2.5"
          >
            <Bell size={20} className="text-white" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Users size={12} className="text-white" />
            <span className="text-xs font-medium text-white">
              {stats.activeUsers.toLocaleString()} active now
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Star size={12} className="text-white" />
            <span className="text-xs font-medium text-white">
              {stats.averageRating} avg rating
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={18} />
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                <TrendingUp size={10} /> {stat.change}
              </span>
            </div>
            <p className="mt-2 text-xl font-bold text-card-foreground">
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingApps.length > 0 && (
        <div className="mt-5 px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Pending Approvals
            </h2>
            <button
              onClick={() => navigate("/admin/restaurants")}
              className="flex items-center gap-0.5 text-xs font-medium text-primary"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {pendingApps.slice(0, 2).map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Store size={18} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">
                    {app.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {app.ownerName} · {app.cuisine}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="mt-5 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Upcoming Events</h2>
          <button
            onClick={() => navigate("/admin/events")}
            className="flex items-center gap-0.5 text-xs font-medium text-primary"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {upcomingEvents.slice(0, 3).map((event) => {
            const typeEmoji = {
              holiday: "🙏",
              festival: "🎊",
              promotion: "📢",
              maintenance: "🔧",
            };
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
              >
                <span className="text-2xl">{typeEmoji[event.type]}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-card-foreground">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays size={10} />
                    {event.startDate} → {event.endDate}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5 px-5">
        <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: "Users", path: "/admin/users", emoji: "👥" },
            { label: "Restaurants", path: "/admin/restaurants", emoji: "🏪" },
            { label: "Events", path: "/admin/events", emoji: "📅" },
            {
              label: "Notifications",
              path: "/admin/notifications",
              emoji: "📣",
            },
            { label: "Reports", path: "/admin/reports", emoji: "📊" },
            { label: "Settings", path: "/settings", emoji: "⚙️" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2.5 rounded-2xl bg-card p-4 shadow-sm transition-all active:scale-[0.97]"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-semibold text-card-foreground">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
