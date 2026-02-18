import { useState } from "react";
import { ArrowLeft, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  target: "all" | "customers" | "restaurants";
  sentAt: string;
}

const SystemNotificationsPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formTarget, setFormTarget] = useState<
    "all" | "customers" | "restaurants"
  >("all");

  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([
    {
      id: "b1",
      title: "🎊 Khmer New Year — Free Delivery!",
      message:
        "Celebrate ចូលឆ្នាំថ្មី with free delivery on all orders April 13–16. សួស្តីឆ្នាំថ្មី!",
      target: "all",
      sentAt: "2026-02-18T09:00:00",
    },
    {
      id: "b2",
      title: "📢 New Feature: Pre-Order for Reservations",
      message:
        "You can now pre-order your food when making a reservation! Try it out today.",
      target: "customers",
      sentAt: "2026-02-15T10:00:00",
    },
    {
      id: "b3",
      title: "📊 Monthly Report Available",
      message:
        "Your January earnings report is ready. Check your dashboard for details.",
      target: "restaurants",
      sentAt: "2026-02-01T08:00:00",
    },
  ]);

  const handleSend = () => {
    if (!formTitle || !formMessage) {
      toast.error("Title and message are required");
      return;
    }
    const newBroadcast: BroadcastMessage = {
      id: `b_${Date.now()}`,
      title: formTitle,
      message: formMessage,
      target: formTarget,
      sentAt: new Date().toISOString(),
    };
    setBroadcasts([newBroadcast, ...broadcasts]);
    toast.success(
      `Notification sent to ${formTarget === "all" ? "everyone" : formTarget}! 📣`,
    );
    setFormTitle("");
    setFormMessage("");
    setFormTarget("all");
    setShowForm(false);
  };

  const targetColor = {
    all: "bg-purple-100 text-purple-700",
    customers: "bg-blue-100 text-blue-700",
    restaurants: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            System Notifications
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Send size={14} /> Broadcast
        </button>
      </div>

      {/* Broadcast History */}
      <div className="space-y-3 px-5">
        {broadcasts.map((b) => (
          <div key={b.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-card-foreground">
                {b.title}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${targetColor[b.target]}`}
              >
                {b.target}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{b.message}</p>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Sent{" "}
              {new Date(b.sentAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Broadcast Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Send Broadcast
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Notification title"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Message *
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Target Audience
                </label>
                <div className="mt-1 flex gap-2">
                  {(["all", "customers", "restaurants"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormTarget(t)}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium capitalize ${
                        formTarget === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSend}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                <Send size={14} /> Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemNotificationsPage;
