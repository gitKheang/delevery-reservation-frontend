import { useState } from "react";
import { ArrowLeft, MapPin, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order, Reservation } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useOrder } from "@/context/OrderContext";
import { toast } from "sonner";

const orderSteps = ["preparing", "almost_ready", "ready", "served"] as const;

const stepLabels: Record<string, string> = {
  preparing: "Preparing",
  almost_ready: "Almost Ready",
  ready: "Ready to Serve",
  served: "Served",
};

const OrderTracker = ({ order }: { order: Order }) => {
  if (order.status === "completed") return null;
  const currentIndex = orderSteps.indexOf(
    order.status as (typeof orderSteps)[number],
  );
  if (currentIndex === -1) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        {orderSteps.map((step, i) => (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                  i <= currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentIndex ? (
                  <CheckCircle2 size={14} />
                ) : i === currentIndex ? (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="mt-1 text-center text-[9px] leading-tight text-muted-foreground">
                {stepLabels[step]}
              </span>
            </div>
            {i < orderSteps.length - 1 && (
              <div
                className={`mx-0.5 mb-4 h-0.5 flex-1 rounded ${
                  i < currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {order.estimatedTime !== "Done" && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-primary">
          <Clock size={12} />
          <span className="font-medium">ETA: {order.estimatedTime}</span>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "reservations">("orders");
  const { orders, reservations, setReservationCheckedIn } = useOrder();

  const handleCheckIn = (res: Reservation) => {
    setReservationCheckedIn(res.id, true);
    toast.success(`Checked in at ${res.restaurantName}! 🎉`);
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      {/* Tabs */}
      <div className="mx-5 flex rounded-xl bg-muted p-1">
        {(["orders", "reservations"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold capitalize transition-all ${
              tab === t
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        {tab === "orders"
          ? orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurantImage}
                      alt={order.restaurantName}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">
                        {order.restaurantName}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.items.length} items · ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Live Order Tracker */}
                <OrderTracker order={order} />

                {/* Item list */}
                <div className="mt-3 space-y-1 border-t border-border pt-2">
                  {order.items.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {order.status === "completed" && (
                    <button
                      onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                      className="text-xs font-medium text-primary"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))
          : reservations.map((res) => {
              const isCheckedIn = Boolean(res.checkedIn);
              const canCheckIn = res.status === "confirmed" && !isCheckedIn;
              return (
                <div key={res.id} className="rounded-2xl bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={res.restaurantImage}
                        alt={res.restaurantName}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground">
                          {res.restaurantName}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {res.guests} guests · Table {res.tableId}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={res.status} />
                  </div>

                  {/* Pre-order info */}
                  {res.preOrder && res.preOrder.length > 0 && (
                    <div className="mt-3 rounded-xl bg-primary/5 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <ChefHat size={12} />
                        <span>Pre-ordered items</span>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {res.preOrder.map((item) => (
                          <p
                            key={item.menuItem.id}
                            className="text-[11px] text-muted-foreground"
                          >
                            {item.quantity}x {item.menuItem.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deposit */}
                  {res.deposit && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <span>Deposit paid:</span>
                      <span className="font-semibold text-success">
                        ${res.deposit.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(res.date).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {res.time}
                      </p>
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                          <CheckCircle2 size={10} />
                          Checked In
                        </span>
                      )}
                    </div>
                    {canCheckIn && (
                      <button
                        onClick={() => handleCheckIn(res)}
                        className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground active:scale-[0.98]"
                      >
                        <MapPin size={12} />
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default OrdersPage;
