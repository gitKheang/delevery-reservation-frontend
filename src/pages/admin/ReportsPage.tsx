import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  mockPlatformStats,
  restaurants,
  mockUserRecords,
} from "@/data/mockData";

const ReportsPage = () => {
  const navigate = useNavigate();
  const stats = mockPlatformStats;

  const monthlyData = [
    { month: "Sep", orders: 7200, revenue: 43200 },
    { month: "Oct", orders: 8100, revenue: 48600 },
    { month: "Nov", orders: 9500, revenue: 57000 },
    { month: "Dec", orders: 11200, revenue: 67200 },
    { month: "Jan", orders: 10800, revenue: 64800 },
    { month: "Feb", orders: 8900, revenue: 53400 },
  ];

  const maxOrders = Math.max(...monthlyData.map((d) => d.orders));

  const topRestaurants = [...restaurants]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  const usersByRole = {
    customer: mockUserRecords.filter((u) => u.role === "customer").length,
    restaurant: mockUserRecords.filter((u) => u.role === "restaurant").length,
    admin: mockUserRecords.filter((u) => u.role === "admin").length,
  };
  const totalUsers = mockUserRecords.length;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          Reports & Analytics
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-5">
        {[
          {
            label: "Total Revenue",
            value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingBag,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
          },
          {
            label: "Avg. Rating",
            value: String(stats.averageRating),
            icon: Star,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
          },
          {
            label: "Active Users",
            value: stats.activeUsers.toLocaleString(),
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-card p-4 shadow-sm">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bgColor}`}
            >
              <card.icon size={18} className={card.color} />
            </div>
            <p className="mt-2 text-lg font-bold text-card-foreground">
              {card.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Orders Chart */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-card-foreground">
            Monthly Orders
          </h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <TrendingUp size={12} /> +8%
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-medium text-muted-foreground">
                {(d.orders / 1000).toFixed(1)}K
              </span>
              <div
                className="w-8 rounded-t-md bg-primary/80"
                style={{
                  height: `${(d.orders / maxOrders) * 100}px`,
                }}
              />
              <span className="text-[10px] text-muted-foreground">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* User Distribution */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-sm font-bold text-card-foreground">
          User Distribution
        </h2>
        <div className="mt-3 space-y-2">
          {[
            {
              label: "Customers",
              count: usersByRole.customer,
              color: "bg-blue-500",
            },
            {
              label: "Restaurant Owners",
              count: usersByRole.restaurant,
              color: "bg-amber-500",
            },
            {
              label: "Admins",
              count: usersByRole.admin,
              color: "bg-purple-500",
            },
          ].map((role) => (
            <div key={role.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{role.label}</span>
                <span className="font-medium text-card-foreground">
                  {role.count}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${role.color}`}
                  style={{
                    width: `${(role.count / totalUsers) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-sm font-bold text-card-foreground">
          Top Restaurants
        </h2>
        <div className="mt-3 space-y-2.5">
          {topRestaurants.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <img
                src={r.image}
                alt={r.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold text-card-foreground">
                  {r.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {r.cuisine} · {r.reviewCount} reviews
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-card-foreground">
                  {r.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
