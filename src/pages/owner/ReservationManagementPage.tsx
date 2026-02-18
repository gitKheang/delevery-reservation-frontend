import { useState } from "react";
import { ArrowLeft, Check, X, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockOwnerReservations } from "@/data/mockData";
import type { Reservation } from "@/data/mockData";
import { toast } from "sonner";

const ReservationManagementPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(mockOwnerReservations);
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "completed"
  >("pending");

  const filteredReservations = reservations.filter(
    (r) => r.status === activeTab,
  );

  const updateStatus = (id: string, status: Reservation["status"]) => {
    setReservations(
      reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    const messages = {
      confirmed: "Reservation confirmed! ✅",
      cancelled: "Reservation declined ❌",
      completed: "Reservation completed",
      pending: "",
    };
    toast.success(messages[status]);
  };

  const statusBadgeColor = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-muted text-muted-foreground",
  } as const;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Reservations</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5">
        {(["pending", "confirmed", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-sm"
            }`}
          >
            {tab} ({reservations.filter((r) => r.status === tab).length})
          </button>
        ))}
      </div>

      {/* Reservations */}
      <div className="mt-4 space-y-3 px-5">
        {filteredReservations.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl">📅</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No {activeTab} reservations
            </p>
          </div>
        )}
        {filteredReservations.map((res) => (
          <div
            key={res.id}
            className="overflow-hidden rounded-2xl bg-card shadow-sm"
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">
                    #{res.id.toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeColor[res.status]}`}
                  >
                    {res.status}
                  </span>
                </div>
                {res.checkedIn && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Checked In
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-card-foreground">
                      {res.date}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {res.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-card-foreground">
                      {res.guests} guests
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Table {res.tableId}
                    </p>
                  </div>
                </div>
              </div>

              {res.deposit && (
                <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                  <p className="text-xs text-emerald-700">
                    💵 Deposit: ${res.deposit.toFixed(2)}
                  </p>
                </div>
              )}

              {res.preOrder && res.preOrder.length > 0 && (
                <div className="mt-2 rounded-lg bg-blue-50 px-3 py-1.5">
                  <p className="text-xs font-medium text-blue-700">
                    🍽️ Pre-Order:
                  </p>
                  {res.preOrder.map((po, idx) => (
                    <p key={idx} className="text-xs text-blue-600">
                      {po.quantity}x {po.menuItem.name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {res.status === "pending" && (
              <div className="flex border-t border-border">
                <button
                  onClick={() => updateStatus(res.id, "cancelled")}
                  className="flex flex-1 items-center justify-center gap-1.5 border-r border-border py-3 text-xs font-medium text-destructive"
                >
                  <X size={14} /> Decline
                </button>
                <button
                  onClick={() => updateStatus(res.id, "confirmed")}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary"
                >
                  <Check size={14} /> Confirm
                </button>
              </div>
            )}
            {res.status === "confirmed" && (
              <div className="flex border-t border-border">
                <button
                  onClick={() => updateStatus(res.id, "completed")}
                  className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary"
                >
                  <Check size={14} /> Mark Completed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationManagementPage;
