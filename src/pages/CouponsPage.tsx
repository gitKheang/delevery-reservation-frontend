import { useState } from "react";
import { ArrowLeft, Copy, Check, Tag, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPromotions } from "@/data/mockData";
import { toast } from "sonner";

const isPromoExpired = (expiresAt: string) => {
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
    expiry.setHours(23, 59, 59, 999);
  }
  return expiry.getTime() < Date.now();
};

const CouponsPage = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).catch(() => {
      /* ignore */
    });
    setCopiedId(id);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-primary/15 text-primary";
      case "fixed":
        return "bg-success/15 text-success";
      case "freeItem":
        return "bg-accent/15 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Coupons & Offers</h1>
      </div>

      {/* Active Coupons Count */}
      <div className="mx-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Tag size={22} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-lg font-bold text-primary-foreground">
            {mockPromotions.length} Active Offers
          </p>
          <p className="text-xs text-primary-foreground/70">
            Apply at checkout for instant savings
          </p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="mt-4 space-y-3 px-5">
        {mockPromotions.map((promo) => {
          const isExpired = isPromoExpired(promo.expiresAt);
          return (
            <div
              key={promo.id}
              className={`rounded-2xl bg-card p-4 shadow-sm ${isExpired ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-card-foreground">
                      {promo.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getTypeColor(promo.type)}`}
                    >
                      {promo.discount}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {promo.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    <span>
                      {isExpired
                        ? "Expired"
                        : `Expires ${new Date(promo.expiresAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-center">
                  <span className="text-sm font-bold tracking-wider text-primary">
                    {promo.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(promo.code, promo.id)}
                  disabled={isExpired}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
                >
                  {copiedId === promo.id ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponsPage;
