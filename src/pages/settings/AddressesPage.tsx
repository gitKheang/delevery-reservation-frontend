import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Trash2,
  CheckCircle2,
  Circle,
  Pencil,
  Star,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAddress } from "@/context/AddressContext";

const AddressesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    addresses,
    selectedAddressId,
    selectedAddress,
    selectAddress,
    setDefaultAddress,
    removeAddress,
  } = useAddress();

  const isSelectMode = searchParams.get("select") === "1";
  const from = searchParams.get("from");

  const flowPath = (path: string) => {
    const params = new URLSearchParams();
    if (isSelectMode) params.set("select", "1");
    if (from) params.set("from", from);
    return params.toString() ? `${path}?${params.toString()}` : path;
  };

  const sortedAddresses = useMemo(
    () =>
      [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses],
  );

  const handleDelete = (id: string) => {
    if (addresses.length <= 1) {
      toast.error("At least one address is required");
      return;
    }
    removeAddress(id);
    toast.success("Address removed");
  };

  const handleConfirmSelection = () => {
    if (from && from.startsWith("/")) {
      toast.success("Delivery address updated");
      navigate(from);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex flex-col pb-28">
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {isSelectMode ? "Choose Delivery Address" : "Saved Addresses"}
            </h1>
            {isSelectMode && (
              <p className="text-[11px] text-muted-foreground">
                Select where your order should be delivered
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate(flowPath("/settings/addresses/search"))}
          className="flex items-center gap-1 text-sm font-semibold text-primary"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-3 px-5">
        {sortedAddresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              className={`rounded-2xl bg-card p-4 shadow-sm ${
                isSelected ? "ring-2 ring-primary/40" : ""
              }`}
            >
              <button
                onClick={() => selectAddress(addr.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MapPin size={15} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-card-foreground">
                      {addr.label}
                    </p>
                    {addr.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Default
                      </span>
                    )}
                    {isSelected && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {addr.addressLine}
                  </p>
                  {addr.details && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {addr.details}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] font-medium text-foreground">
                    {addr.recipientName} · {addr.phone}
                  </p>
                </div>
                <div className="mt-1">
                  {isSelected ? (
                    <CheckCircle2 size={18} className="text-primary" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              <div className="mt-3 flex items-center justify-between">
                {!addr.isDefault ? (
                  <button
                    onClick={() => {
                      setDefaultAddress(addr.id);
                      toast.success("Default address updated");
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <Star size={13} />
                    Set as Default
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      navigate(flowPath(`/settings/addresses/${addr.id}/edit`))
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-foreground"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-destructive"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sortedAddresses.length === 0 && (
          <div className="rounded-2xl bg-card px-4 py-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-card-foreground">
              No saved addresses
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your first address to start ordering.
            </p>
            <button
              onClick={() => navigate(flowPath("/settings/addresses/search"))}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Add Address
            </button>
          </div>
        )}
      </div>

      {isSelectMode && selectedAddress && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-md px-5">
          <button
            onClick={handleConfirmSelection}
            className="flex w-full items-center justify-center gap-1 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg active:scale-[0.98]"
          >
            Deliver to {selectedAddress.label}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;

