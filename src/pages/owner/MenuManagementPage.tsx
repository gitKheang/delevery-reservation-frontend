import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { restaurants } from "@/data/mockData";
import type { MenuItem, FoodStatus } from "@/data/mockData";
import { toast } from "sonner";

const MenuManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const restaurant = restaurants.find((r) => r.id === user?.restaurantId);

  const [items, setItems] = useState<MenuItem[]>(restaurant?.menu ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("khmer");
  const [formStatus, setFormStatus] = useState<FoodStatus>("available");

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resetForm = () => {
    setFormName("");
    setFormDesc("");
    setFormPrice("");
    setFormCategory("khmer");
    setFormStatus("available");
    setEditingItem(null);
    setShowForm(false);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(String(item.price));
    setFormCategory(item.category);
    setFormStatus(item.status);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName || !formPrice) {
      toast.error("Name and price are required");
      return;
    }

    if (editingItem) {
      setItems(
        items.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name: formName,
                description: formDesc,
                price: parseFloat(formPrice),
                category: formCategory,
                status: formStatus,
              }
            : i,
        ),
      );
      toast.success(`"${formName}" updated! ✏️`);
    } else {
      const newItem: MenuItem = {
        id: `m_new_${Date.now()}`,
        name: formName,
        description: formDesc,
        price: parseFloat(formPrice),
        image: items[0]?.image ?? "",
        category: formCategory,
        status: formStatus,
        rating: 0,
      };
      setItems([...items, newItem]);
      toast.success(`"${formName}" added to menu! 🎉`);
    }
    resetForm();
  };

  const handleDelete = (item: MenuItem) => {
    setItems(items.filter((i) => i.id !== item.id));
    toast.success(`"${item.name}" removed from menu`);
  };

  const toggleStatus = (item: MenuItem) => {
    const nextStatus: Record<FoodStatus, FoodStatus> = {
      available: "sold_out",
      sold_out: "available",
      time_based: "available",
    };
    setItems(
      items.map((i) =>
        i.id === item.id ? { ...i, status: nextStatus[i.status] } : i,
      ),
    );
    toast.success(
      `"${item.name}" marked as ${nextStatus[item.status].replace("_", " ")}`,
    );
  };

  const statusBadge = {
    available: "bg-emerald-100 text-emerald-700",
    sold_out: "bg-red-100 text-red-700",
    time_based: "bg-amber-100 text-amber-700",
  };

  const categoryOptions = [
    { value: "khmer", label: "Khmer" },
    { value: "street", label: "Street Food" },
    { value: "noodles", label: "Noodles" },
    { value: "bbq", label: "BBQ & Grill" },
    { value: "dessert", label: "Desserts" },
    { value: "drinks", label: "Drinks" },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Menu Management</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="px-5">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-3 px-5">
        <div className="flex-1 rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-lg font-bold text-emerald-700">
            {items.filter((i) => i.status === "available").length}
          </p>
          <p className="text-[10px] text-emerald-600">Available</p>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 p-3 text-center">
          <p className="text-lg font-bold text-red-700">
            {items.filter((i) => i.status === "sold_out").length}
          </p>
          <p className="text-[10px] text-red-600">Sold Out</p>
        </div>
        <div className="flex-1 rounded-xl bg-amber-50 p-3 text-center">
          <p className="text-lg font-bold text-amber-700">
            {items.filter((i) => i.status === "time_based").length}
          </p>
          <p className="text-[10px] text-amber-600">Time-Based</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-4 space-y-2.5 px-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-card-foreground">
                    {item.name}
                  </h3>
                  <button onClick={() => toggleStatus(item)}>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge[item.status]}`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="rounded-lg bg-blue-50 p-1.5"
                  >
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-lg bg-red-50 p-1.5"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button onClick={resetForm}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Fish Amok"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe the dish..."
                  rows={2}
                  className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1 flex gap-2">
                  {(["available", "sold_out", "time_based"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setFormStatus(s)}
                        className={`flex-1 rounded-xl py-2 text-xs font-medium ${
                          formStatus === s
                            ? statusBadge[s]
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                {editingItem ? "Save Changes" : "Add to Menu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
