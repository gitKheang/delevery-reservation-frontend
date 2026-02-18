import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  Shield,
} from "lucide-react";

const settingsItems = [
  { icon: User, label: "Edit Profile", path: "/settings/edit-profile" },
  { icon: MapPin, label: "Saved Addresses", path: "/settings/addresses" },
  { icon: CreditCard, label: "Payment Methods", path: "/settings/payment" },
  {
    icon: Bell,
    label: "Notifications",
    path: "/settings/notifications",
  },
  { icon: Globe, label: "Language", path: "/settings/language" },
  { icon: Shield, label: "Privacy Policy", path: "/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/settings/help" },
  { icon: Info, label: "About", path: "/settings/about" },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Settings</h1>
      </div>

      {/* Settings List */}
      <div className="mx-5 overflow-hidden rounded-2xl bg-card shadow-sm">
        {settingsItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 px-4 py-4 ${
              index < settingsItems.length - 1 ? "border-b border-border" : ""
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

      {/* App Version */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        FoodReserve v1.0.0
      </p>
    </div>
  );
};

export default SettingsPage;
