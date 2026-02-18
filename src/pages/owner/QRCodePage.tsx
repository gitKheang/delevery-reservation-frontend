import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { restaurants } from "@/data/mockData";
import { toast } from "sonner";

const QRCodePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const restaurant = restaurants.find((r) => r.id === user?.restaurantId);

  const handleDownload = () => {
    toast.success("QR Code downloaded! 📥");
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard! 📋");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">QR Code</h1>
      </div>

      <div className="flex flex-col items-center px-5 pt-8">
        {/* QR Code Display */}
        <div className="rounded-3xl bg-card p-6 shadow-lg">
          <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white p-4">
            {/* Mock QR Code Pattern */}
            <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => {
                // Create a deterministic QR-like pattern
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isFilled =
                  // Corner squares
                  (row < 3 && col < 3) ||
                  (row < 3 && col > 4) ||
                  (row > 4 && col < 3) ||
                  // Random data pattern
                  (row === 3 && col % 2 === 0) ||
                  (row === 4 && col % 2 === 1) ||
                  (col === 3 && row % 2 === 0) ||
                  (col === 4 && row % 2 === 1) ||
                  (row > 4 && col > 4 && (row + col) % 3 === 0);
                return (
                  <div
                    key={i}
                    className={`rounded-sm ${isFilled ? "bg-foreground" : "bg-white"}`}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-base font-bold text-card-foreground">
              {restaurant?.name ?? "My Restaurant"}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Scan to view menu & order
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 w-full rounded-2xl bg-card p-4 shadow-sm">
          <h3 className="text-sm font-bold text-card-foreground">
            How to use your QR Code
          </h3>
          <div className="mt-3 space-y-2.5">
            {[
              "Print and place on each table for dine-in ordering",
              "Add to your restaurant's entrance for takeaway menus",
              "Share on social media (Facebook, Telegram) to drive orders",
              "Include in flyers and marketing materials",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.97]"
          >
            <Download size={16} /> Download
          </button>
          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground active:scale-[0.97]"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
