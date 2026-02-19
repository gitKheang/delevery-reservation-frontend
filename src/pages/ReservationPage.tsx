import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
  Plus,
  Minus,
  Trash2,
  ChefHat,
} from "lucide-react";
import { restaurants } from "@/data/mockData";
import type { CartItem } from "@/data/mockData";
import { toast } from "sonner";
import { useOrder } from "@/context/OrderContext";

const timeSlots = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReservation } = useOrder();
  const restaurant = restaurants.find((r) => r.id === id);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState("");
  const [step, setStep] = useState(1);
  const [preOrderItems, setPreOrderItems] = useState<CartItem[]>([]);
  const [showPreOrder, setShowPreOrder] = useState(false);

  if (!restaurant) return <div className="p-5 pt-12">Not found</div>;

  const availableTables = restaurant.tables.filter(
    (t) => t.available && t.seats >= guests,
  );

  const preOrderTotal = preOrderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  const depositAmount = 10.0;

  const addPreOrderItem = (menuItem: (typeof restaurant.menu)[0]) => {
    setPreOrderItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const updatePreOrderQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setPreOrderItems((prev) => prev.filter((i) => i.menuItem.id !== id));
      return;
    }
    setPreOrderItems((prev) =>
      prev.map((i) => (i.menuItem.id === id ? { ...i, quantity: qty } : i)),
    );
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !selectedTable) {
      toast.error("Please complete reservation details");
      return;
    }

    addReservation({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.image,
      date: selectedDate,
      time: selectedTime,
      guests,
      status: "confirmed",
      tableId: selectedTable,
      checkedIn: false,
      deposit: depositAmount,
      preOrder: preOrderItems.length > 0 ? preOrderItems : undefined,
    });

    toast.success("Reservation confirmed! 🎉");
    navigate("/orders");
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en", { month: "short" }),
    };
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Reserve a Table</h1>
      </div>

      {/* Restaurant Mini Card */}
      <div className="mx-5 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-14 w-14 rounded-xl object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {restaurant.name}
          </h3>
          <p className="text-xs text-muted-foreground">{restaurant.address}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mt-5 flex items-center justify-center gap-2 px-5">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check size={14} /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 w-6 rounded ${step > s ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="px-5 pb-4 pt-5">
        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar size={16} /> Select Date
              </label>
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {dates.map((d) => (
                  <button
                    key={d.full}
                    onClick={() => setSelectedDate(d.full)}
                    className={`flex flex-shrink-0 flex-col items-center rounded-xl px-4 py-3 text-xs transition-all ${
                      selectedDate === d.full
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground shadow-sm"
                    }`}
                  >
                    <span className="font-medium">{d.day}</span>
                    <span className="mt-0.5 text-lg font-bold">{d.date}</span>
                    <span className="text-[10px]">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock size={16} /> Select Time
              </label>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-xl py-2.5 text-xs font-medium transition-all ${
                      selectedTime === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground shadow-sm"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => selectedDate && selectedTime && setStep(2)}
              disabled={!selectedDate || !selectedTime}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-40 active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Guests & Table */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users size={16} /> Number of Guests
              </label>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-lg font-bold text-card-foreground shadow-sm"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-foreground">
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(12, guests + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin size={16} /> Select Table
              </label>
              <div className="mt-3 flex flex-col gap-2">
                {availableTables.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No tables available for {guests} guests
                  </p>
                ) : (
                  availableTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                        selectedTable === table.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground shadow-sm"
                      }`}
                    >
                      <span className="font-medium">{table.location}</span>
                      <span className="text-xs opacity-70">
                        {table.seats} seats
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground"
              >
                Back
              </button>
              <button
                onClick={() => selectedTable && setStep(3)}
                disabled={!selectedTable}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pre-Order Food */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                <ChefHat size={18} />
                Pre-Order Food
              </h2>
              <button
                onClick={() => setShowPreOrder(!showPreOrder)}
                className="text-xs font-medium text-primary"
              >
                {showPreOrder ? "Hide Menu" : "Browse Menu"}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Pre-order to have food ready when you arrive. This step is
              optional.
            </p>

            {/* Menu items to add */}
            {showPreOrder && (
              <div className="space-y-2">
                {restaurant.menu
                  .filter((m) => m.status !== "sold_out")
                  .map((item) => {
                    const inCart = preOrderItems.find(
                      (i) => i.menuItem.id === item.id,
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-card-foreground">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updatePreOrderQty(item.id, inCart.quantity - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"
                            >
                              {inCart.quantity <= 1 ? (
                                <Trash2
                                  size={11}
                                  className="text-destructive"
                                />
                              ) : (
                                <Minus size={11} className="text-foreground" />
                              )}
                            </button>
                            <span className="text-xs font-bold text-foreground">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updatePreOrderQty(item.id, inCart.quantity + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                            >
                              <Plus
                                size={11}
                                className="text-primary-foreground"
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addPreOrderItem(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary"
                          >
                            <Plus
                              size={14}
                              className="text-primary-foreground"
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Pre-order summary */}
            {preOrderItems.length > 0 && (
              <div className="rounded-2xl bg-primary/5 p-4">
                <h4 className="text-xs font-semibold text-primary">
                  Pre-Order Summary
                </h4>
                <div className="mt-2 space-y-1">
                  {preOrderItems.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-primary/20 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>Pre-Order Total</span>
                      <span>${preOrderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
              >
                {preOrderItems.length > 0 ? "Continue" : "Skip"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">
              Confirm Reservation
            </h2>
            <div className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Restaurant</span>
                <span className="font-medium text-card-foreground">
                  {restaurant.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-card-foreground">
                  {selectedDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-card-foreground">
                  {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-medium text-card-foreground">
                  {guests}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Table</span>
                <span className="font-medium text-card-foreground">
                  {
                    restaurant.tables.find((t) => t.id === selectedTable)
                      ?.location
                  }
                </span>
              </div>
            </div>

            {/* Pre-order summary in confirmation */}
            {preOrderItems.length > 0 && (
              <div className="rounded-2xl bg-primary/5 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <ChefHat size={14} />
                  Pre-Ordered Items
                </div>
                <div className="mt-2 space-y-1">
                  {preOrderItems.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deposit */}
            <div className="rounded-2xl border border-primary/20 bg-card p-4 shadow-sm">
              <h4 className="text-sm font-semibold text-card-foreground">
                Reservation Deposit
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                A deposit of{" "}
                <span className="font-bold text-primary">
                  ${depositAmount.toFixed(2)}
                </span>{" "}
                is required to confirm your reservation. This will be deducted
                from your bill.
              </p>
              {preOrderItems.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-border pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Pre-Order Total
                    </span>
                    <span className="text-foreground">
                      ${preOrderTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="text-foreground">
                      ${depositAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-card-foreground">Total Due Now</span>
                    <span className="text-primary">
                      ${(preOrderTotal + depositAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                Pay & Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
