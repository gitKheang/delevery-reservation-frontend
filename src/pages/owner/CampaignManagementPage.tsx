import { useState } from "react";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPromotions } from "@/data/mockData";
import type { Promotion } from "@/data/mockData";
import { toast } from "sonner";

const isExpired = (expiresAt: string) => {
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
    expiry.setHours(23, 59, 59, 999);
  }
  return expiry.getTime() < Date.now();
};

const CampaignManagementPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Promotion[]>(mockPromotions);
  const [showForm, setShowForm] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDiscount, setFormDiscount] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formType, setFormType] = useState<Promotion["type"]>("percentage");

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormDiscount("");
    setFormCode("");
    setFormExpiry("");
    setFormType("percentage");
    setShowForm(false);
  };

  const handleCreate = () => {
    if (!formTitle || !formCode || !formDiscount) {
      toast.error("Title, code, and discount are required");
      return;
    }
    const newCampaign: Promotion = {
      id: `p_new_${Date.now()}`,
      title: formTitle,
      description: formDesc,
      discount: formType === "freeItem" ? "Free Item" : formDiscount,
      code: formCode.toUpperCase(),
      expiresAt: formExpiry || "2026-12-31",
      type: formType,
    };
    setCampaigns([newCampaign, ...campaigns]);
    toast.success(`Campaign "${formTitle}" created! 🎉`);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    toast.success("Campaign deleted");
  };

  const typeLabel = {
    percentage: "% Off",
    fixed: "$ Off",
    freeItem: "Free Item",
  };

  const typeColor = {
    percentage: "bg-blue-100 text-blue-700",
    fixed: "bg-emerald-100 text-emerald-700",
    freeItem: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Campaigns</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Create
        </button>
      </div>

      {/* Campaign List */}
      <div className="space-y-3 px-5">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={`overflow-hidden rounded-2xl bg-card shadow-sm ${
              isExpired(campaign.expiresAt) ? "opacity-60" : ""
            }`}
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-card-foreground">
                    {campaign.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColor[campaign.type]}`}
                  >
                    {typeLabel[campaign.type]}
                  </span>
                </div>
                <button onClick={() => handleDelete(campaign.id)}>
                  <Trash2 size={14} className="text-muted-foreground" />
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {campaign.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground">
                    {campaign.code}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {campaign.discount}
                  </span>
                </div>
                <span
                  className={`text-[10px] ${
                    isExpired(campaign.expiresAt)
                      ? "font-medium text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {isExpired(campaign.expiresAt)
                    ? "Expired"
                    : `Expires ${campaign.expiresAt}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Create Campaign
              </h2>
              <button onClick={resetForm}>
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
                  placeholder="e.g. Khmer New Year Special"
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
                  placeholder="Describe the promotion..."
                  rows={2}
                  className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Type
                </label>
                <div className="mt-1 flex gap-2">
                  {(["percentage", "fixed", "freeItem"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormType(t)}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium ${
                        formType === t
                          ? typeColor[t]
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {typeLabel[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Discount *
                  </label>
                  <input
                    type="text"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    placeholder={formType === "percentage" ? "20%" : "$5"}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="KNY2026"
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagementPage;
