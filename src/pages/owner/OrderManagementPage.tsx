import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockOwnerOrders } from "@/data/mockData";
import type { Order } from "@/data/mockData";
import { toast } from "sonner";

type OrderStatus = Order["status"];

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockOwnerOrders);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const filteredOrders =
    activeTab === "active"
      ? orders.filter((o) => o.status !== "completed")
      : orders.filter((o) => o.status === "completed");

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    toast.success(
      `Order #${orderId.toUpperCase()} → ${newStatus.replace("_", " ")}`,
    );
  };

  const statusFlow: Record<string, OrderStatus | null> = {
    preparing: "almost_ready",
    almost_ready: "ready",
    ready: "served",
    served: "completed",
    completed: null,
  };

  const statusColor = {
    preparing: "bg-amber-100 text-amber-700 border-amber-200",
    almost_ready: "bg-blue-100 text-blue-700 border-blue-200",
    ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
    served: "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-muted text-muted-foreground border-border",
  } as const;

  const nextLabel: Record<string, string> = {
    preparing: "Mark Almost Ready",
    almost_ready: "Mark Ready",
    ready: "Mark Served",
    served: "Complete",
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Order Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5">
        {(["active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-sm"
            }`}
          >
            {tab} (
            {tab === "active"
              ? orders.filter((o) => o.status !== "completed").length
              : orders.filter((o) => o.status === "completed").length}
            )
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="mt-4 space-y-3 px-5">
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No {activeTab} orders
            </p>
          </div>
        )}
        {filteredOrders.map((order) => {
          const next = statusFlow[order.status];
          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl bg-card shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">
                    #{order.id.toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusColor[order.status]}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="px-4 py-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-card-foreground">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <span className="text-sm font-bold text-primary">
                  ${order.total.toFixed(2)}
                </span>
                {next && (
                  <button
                    onClick={() => updateOrderStatus(order.id, next)}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground active:scale-[0.97]"
                  >
                    {nextLabel[order.status]}
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

export default OrderManagementPage;
