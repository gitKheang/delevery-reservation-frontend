/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { mockOrders, mockReservations } from "@/data/mockData";
import type { Order, Reservation } from "@/data/mockData";

type CreateOrderInput = Omit<Order, "id" | "createdAt"> & {
  createdAt?: string;
};
type CreateReservationInput = Omit<Reservation, "id">;

interface OrderContextType {
  orders: Order[];
  reservations: Reservation[];
  addOrder: (input: CreateOrderInput) => Order;
  addReservation: (input: CreateReservationInput) => Reservation;
  setReservationCheckedIn: (id: string, checkedIn: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [reservations, setReservations] = useState<Reservation[]>(
    mockReservations,
  );

  const addOrder = (input: CreateOrderInput): Order => {
    const next: Order = {
      ...input,
      id: `ord-${Date.now()}`,
      createdAt: input.createdAt ?? new Date().toISOString(),
    };
    setOrders((prev) => [next, ...prev]);
    return next;
  };

  const addReservation = (input: CreateReservationInput): Reservation => {
    const next: Reservation = {
      ...input,
      id: `r-${Date.now()}`,
    };
    setReservations((prev) => [next, ...prev]);
    return next;
  };

  const setReservationCheckedIn = (id: string, checkedIn: boolean) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, checkedIn } : reservation,
      ),
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        reservations,
        addOrder,
        addReservation,
        setReservationCheckedIn,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};
