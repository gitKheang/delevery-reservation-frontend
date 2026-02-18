import {
  Home,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  Users,
  Store,
  CalendarDays,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const customerTabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/search", icon: Search, label: "Search" },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/orders", icon: ClipboardList, label: "Orders" },
  { path: "/profile", icon: User, label: "Profile" },
];

const ownerTabs = [
  { path: "/owner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/owner/menu", icon: UtensilsCrossed, label: "Menu" },
  { path: "/owner/orders", icon: ClipboardList, label: "Orders" },
  { path: "/owner/reservations", icon: CalendarCheck, label: "Bookings" },
  { path: "/profile", icon: User, label: "Profile" },
];

const adminTabs = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/restaurants", icon: Store, label: "Restaurants" },
  { path: "/admin/events", icon: CalendarDays, label: "Events" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tabs =
    user?.role === "admin"
      ? adminTabs
      : user?.role === "restaurant"
        ? ownerTabs
        : customerTabs;

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-border bg-card/95 px-2 py-2 backdrop-blur-lg">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
