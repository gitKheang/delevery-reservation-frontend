/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { mockPaymentMethods } from "@/data/mockData";
import type { PaymentMethod } from "@/data/mockData";

interface PaymentContextType {
  methods: PaymentMethod[];
  setDefaultMethod: (id: string) => void;
  removeMethod: (id: string) => void;
  addMockCardMethod: () => PaymentMethod;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const setDefaultMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const removeMethod = (id: string) => {
    setMethods((prev) => {
      const target = prev.find((method) => method.id === id);
      const remaining = prev.filter((method) => method.id !== id);
      if (!target?.isDefault || remaining.length === 0) return remaining;
      return remaining.map((method, index) => ({
        ...method,
        isDefault: index === 0,
      }));
    });
  };

  const addMockCardMethod = (): PaymentMethod => {
    const last4 = String(Date.now()).slice(-4);
    const next: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "card",
      label: "Visa",
      last4,
      icon: "💳",
      isDefault: methods.length === 0,
    };
    setMethods((prev) => [next, ...prev]);
    return next;
  };

  return (
    <PaymentContext.Provider
      value={{ methods, setDefaultMethod, removeMethod, addMockCardMethod }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
};
