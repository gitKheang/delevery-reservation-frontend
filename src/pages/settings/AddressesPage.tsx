import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    address: "456 Business Ave, Suite 200, New York, NY 10002",
    isDefault: false,
  },
];

const AddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Saved Addresses</h1>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary">
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Addresses */}
      <div className="space-y-3 px-5">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-card-foreground">
                      {addr.label}
                    </h3>
                    {addr.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {addr.address}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(addr.id)}>
                <Trash2 size={16} className="text-muted-foreground" />
              </button>
            </div>
            {!addr.isDefault && (
              <button
                onClick={() => handleSetDefault(addr.id)}
                className="mt-3 text-xs font-medium text-primary"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesPage;
