import { useState } from "react";
import { ArrowLeft, Check, X, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockRestaurantApplications } from "@/data/mockData";
import type { RestaurantApplication } from "@/data/mockData";
import { toast } from "sonner";

const RestaurantApprovalPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(mockRestaurantApplications);
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  const filteredApps = applications.filter((a) => a.status === activeTab);

  const updateStatus = (
    id: string,
    status: RestaurantApplication["status"],
  ) => {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    const msgs = {
      approved: "Restaurant approved! ✅",
      rejected: "Application declined ❌",
      pending: "",
    };
    toast.success(msgs[status]);
  };

  const statusColor = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  } as const;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          Restaurant Approvals
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5">
        {(["pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-sm"
            }`}
          >
            {tab} ({applications.filter((a) => a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Applications */}
      <div className="mt-4 space-y-3 px-5">
        {filteredApps.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl">🏪</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No {activeTab} applications
            </p>
          </div>
        )}
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="overflow-hidden rounded-2xl bg-card shadow-sm"
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-card-foreground">
                    {app.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    by {app.ownerName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                    {app.cuisine}
                  </span>
                  <span>Applied {app.appliedAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  {app.address}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone size={12} />
                  {app.phone}
                </div>
              </div>
            </div>

            {/* Actions for pending */}
            {app.status === "pending" && (
              <div className="flex border-t border-border">
                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="flex flex-1 items-center justify-center gap-1.5 border-r border-border py-3 text-xs font-medium text-destructive"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  onClick={() => updateStatus(app.id, "approved")}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantApprovalPage;
