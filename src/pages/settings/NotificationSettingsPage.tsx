import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialSettings: NotifSetting[] = [
  {
    id: "orders",
    label: "Order Updates",
    description: "Get notified about order status changes",
    enabled: true,
  },
  {
    id: "reservations",
    label: "Reservation Reminders",
    description: "Reminders before your reservations",
    enabled: true,
  },
  {
    id: "promotions",
    label: "Promotions & Offers",
    description: "Special deals and discount codes",
    enabled: false,
  },
  {
    id: "reviews",
    label: "Review Requests",
    description: "Reminders to rate your experience",
    enabled: true,
  },
  {
    id: "news",
    label: "News & Updates",
    description: "App updates and new features",
    enabled: false,
  },
];

const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotifSetting[]>(initialSettings);

  const toggle = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Notifications</h1>
      </div>

      {/* Settings */}
      <div className="mx-5 overflow-hidden rounded-2xl bg-card shadow-sm">
        {settings.map((setting, index) => (
          <div
            key={setting.id}
            className={`flex items-center justify-between px-4 py-4 ${
              index < settings.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-card-foreground">
                {setting.label}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <button
              onClick={() => toggle(setting.id)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                setting.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  setting.enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
