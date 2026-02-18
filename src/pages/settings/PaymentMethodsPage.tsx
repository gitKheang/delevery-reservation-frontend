import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CreditCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const initialMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiry: "06/26",
    isDefault: false,
  },
];

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

  const handleDelete = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };

  const handleSetDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payment method updated");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Payment Methods</h1>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary">
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3 px-5">
        {methods.map((method) => (
          <div key={method.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-muted">
                  <CreditCard size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold capitalize text-card-foreground">
                      {method.type} •••• {method.last4}
                    </h3>
                    {method.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(method.id)}>
                <Trash2 size={16} className="text-muted-foreground" />
              </button>
            </div>
            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method.id)}
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

export default PaymentMethodsPage;
