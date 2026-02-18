import { useState } from "react";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockUserRecords } from "@/data/mockData";
import type { UserRecord } from "@/data/mockData";
import { toast } from "sonner";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUserRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRecord["role"]>(
    "all",
  );
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const updateStatus = (id: string, status: UserRecord["status"]) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)));
    setActionMenuId(null);
    const msgs = {
      active: "User activated ✅",
      suspended: "User suspended ⛔",
      pending: "User set to pending",
    };
    toast.success(msgs[status]);
  };

  const roleColor = {
    customer: "bg-blue-100 text-blue-700",
    restaurant: "bg-amber-100 text-amber-700",
    admin: "bg-purple-100 text-purple-700",
  } as const;

  const statusColor = {
    active: "bg-emerald-100 text-emerald-700",
    suspended: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  } as const;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">User Management</h1>
      </div>

      {/* Search */}
      <div className="px-5">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="mt-3 flex gap-2 px-5">
        {(["all", "customer", "restaurant", "admin"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              roleFilter === role
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground shadow-sm"
            }`}
          >
            {role}{" "}
            {role === "all"
              ? `(${users.length})`
              : `(${users.filter((u) => u.role === role).length})`}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="mt-4 space-y-2.5 px-5">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="relative rounded-2xl bg-card p-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-card-foreground">
                    {user.name}
                  </p>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${roleColor[user.role]}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${statusColor[user.status]}`}
                  >
                    {user.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>📱 {user.phone}</span>
                  <span>Joined {user.joinedAt}</span>
                  {user.totalOrders > 0 && (
                    <span>{user.totalOrders} orders</span>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  setActionMenuId(actionMenuId === user.id ? null : user.id)
                }
                className="rounded-lg p-1.5 hover:bg-muted"
              >
                <MoreVertical size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Action Menu */}
            {actionMenuId === user.id && (
              <div className="absolute right-3 top-14 z-10 min-w-[140px] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {user.status !== "active" && (
                  <button
                    onClick={() => updateStatus(user.id, "active")}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-emerald-600 hover:bg-muted"
                  >
                    ✅ Activate
                  </button>
                )}
                {user.status !== "suspended" && user.role !== "admin" && (
                  <button
                    onClick={() => updateStatus(user.id, "suspended")}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-destructive hover:bg-muted"
                  >
                    ⛔ Suspend
                  </button>
                )}
                <button
                  onClick={() => setActionMenuId(null)}
                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagementPage;
