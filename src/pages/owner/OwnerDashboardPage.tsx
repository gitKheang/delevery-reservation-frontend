import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  CalendarCheck,
  DollarSign,
  Star,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  mockOwnerOrders,
  mockOwnerReservations,
  restaurants,
} from "@/data/mockData";

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const restaurant = restaurants.find((r) => r.id === user?.restaurantId);
  const activeOrders = mockOwnerOrders.filter(
    (o) => o.status !== "completed",
  ).length;
  const pendingReservations = mockOwnerReservations.filter(
    (r) => r.status === "pending",
  ).length;
  const todayRevenue = mockOwnerOrders
    .filter((o) => o.createdAt.startsWith("2026-02-18"))
    .reduce((sum, o) => sum + o.total, 0);

  const quickStats = [
    {
      label: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Active Orders",
      value: String(activeOrders),
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending Bookings",
      value: String(pendingReservations),
      icon: CalendarCheck,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Rating",
      value: String(restaurant?.rating ?? "—"),
      icon: Star,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const recentOrders = mockOwnerOrders.slice(0, 3);

  const statusColor = {
    preparing: "bg-amber-100 text-amber-700",
    almost_ready: "bg-blue-100 text-blue-700",
    ready: "bg-emerald-100 text-emerald-700",
    served: "bg-purple-100 text-purple-700",
    completed: "bg-muted text-muted-foreground",
  } as const;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pb-6 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-foreground/70">
              Restaurant Dashboard
            </p>
            <h1 className="text-lg font-bold text-primary-foreground">
              {restaurant?.name ?? "My Restaurant"}
            </h1>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="relative rounded-full bg-primary-foreground/15 p-2.5"
          >
            <Bell size={20} className="text-primary-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
        <p className="mt-1 text-xs text-primary-foreground/60">
          {restaurant?.address}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-lg font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Overview */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-card-foreground">
            Weekly Overview
          </h2>
          <TrendingUp size={16} className="text-emerald-500" />
        </div>
        <div className="mt-3 flex items-end justify-between gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const heights = [45, 65, 55, 80, 70, 90, 60];
            const isToday = i === 2; // Wednesday
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 rounded-t-md ${isToday ? "bg-primary" : "bg-primary/20"}`}
                  style={{ height: `${heights[i]}px` }}
                />
                <span
                  className={`text-[10px] ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-5 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Recent Orders</h2>
          <button
            onClick={() => navigate("/owner/orders")}
            className="flex items-center gap-0.5 text-xs font-medium text-primary"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-card-foreground">
                    #{order.id.toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[order.status]}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {order.items
                    .map((i) => `${i.quantity}x ${i.menuItem.name}`)
                    .join(", ")}
                </p>
              </div>
              <span className="text-sm font-bold text-primary">
                ${order.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5 px-5">
        <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: "Manage Menu", path: "/owner/menu", emoji: "📋" },
            { label: "Reservations", path: "/owner/reservations", emoji: "📅" },
            { label: "Campaigns", path: "/owner/campaigns", emoji: "📢" },
            { label: "QR Code", path: "/owner/qr-code", emoji: "📱" },
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

export default OwnerDashboardPage;
