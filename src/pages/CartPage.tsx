import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Check,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAddress } from "@/context/AddressContext";
import { useOrder } from "@/context/OrderContext";
import { usePayment } from "@/context/PaymentContext";
import { mockPromotions, restaurants } from "@/data/mockData";
import { toast } from "sonner";

const isPromoExpired = (expiresAt: string) => {
  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
    expiry.setHours(23, 59, 59, 999);
  }
  return expiry.getTime() < Date.now();
};

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } =
    useCart();
  const { selectedAddress } = useAddress();
  const { addOrder } = useOrder();
  const { methods: paymentMethods, setDefaultMethod } = usePayment();
  const selectedPaymentId =
    paymentMethods.find((p) => p.isDefault)?.id ?? paymentMethods[0]?.id ?? "";

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const serviceFee = items.length > 0 ? 1.5 : 0;
  const grandTotal = total + deliveryFee + serviceFee - promoDiscount;

  const handleApplyPromo = () => {
    const promo = mockPromotions.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase(),
    );
    if (!promo) {
      toast.error("Invalid promo code");
      return;
    }
    if (isPromoExpired(promo.expiresAt)) {
      toast.error("This promo code has expired");
      return;
    }
    if (promo.type === "percentage") {
      const discount = total * (parseFloat(promo.discount) / 100);
      setPromoDiscount(parseFloat(discount.toFixed(2)));
    } else if (promo.type === "fixed") {
      setPromoDiscount(parseFloat(promo.discount.replace("$", "")));
    } else {
      setPromoDiscount(0);
    }
    setAppliedPromo(promo.code);
    toast.success(`Promo "${promo.code}" applied! 🎉`);
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please choose a delivery address");
      navigate("/settings/addresses?select=1&from=/cart");
      return;
    }
    if (!selectedPaymentId) {
      toast.error("Please add a payment method");
      return;
    }

    const restaurantIds = Array.from(
      new Set(
        items
          .map((cartItem) =>
            restaurants.find((r) =>
              r.menu.some((menuItem) => menuItem.id === cartItem.menuItem.id),
            )?.id,
          )
          .filter((id): id is string => Boolean(id)),
      ),
    );
    if (restaurantIds.length !== 1) {
      toast.error("Please checkout one restaurant at a time");
      return;
    }

    const checkoutRestaurant = restaurants.find((r) => r.id === restaurantIds[0]);
    if (!checkoutRestaurant) {
      toast.error("Restaurant not found for selected items");
      return;
    }

    addOrder({
      restaurantId: checkoutRestaurant.id,
      restaurantName: checkoutRestaurant.name,
      restaurantImage: checkoutRestaurant.image,
      items: items.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })),
      total: Number(grandTotal.toFixed(2)),
      status: "preparing",
      estimatedTime: "20-30 min",
    });

    const pm = paymentMethods.find((p) => p.id === selectedPaymentId);
    toast.success(
      `Order placed to ${selectedAddress.label} via ${pm?.label}! 🎉`,
    );
    clearCart();
    navigate("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 pt-32">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Browse restaurants and add items to get started
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            Cart ({itemCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-medium text-destructive"
        >
          Clear All
        </button>
      </div>

      {/* Delivery Address */}
      <div className="mx-5 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <MapPin size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Delivery Address
              </p>
              {selectedAddress ? (
                <>
                  <p className="mt-0.5 text-sm font-bold text-card-foreground">
                    {selectedAddress.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAddress.addressLine}
                  </p>
                </>
              ) : (
                <p className="mt-0.5 text-sm font-semibold text-destructive">
                  No address selected
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate("/settings/addresses?select=1&from=/cart")}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            Change
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="mt-4 space-y-3 px-5">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm"
          >
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  {item.menuItem.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  ${item.menuItem.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      item.quantity <= 1
                        ? removeItem(item.menuItem.id)
                        : updateQuantity(item.menuItem.id, item.quantity - 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-muted"
                  >
                    {item.quantity <= 1 ? (
                      <Trash2 size={13} className="text-destructive" />
                    ) : (
                      <Minus size={13} className="text-foreground" />
                    )}
                  </button>
                  <span className="text-sm font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity + 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-primary"
                  >
                    <Plus size={13} className="text-primary-foreground" />
                  </button>
                </div>
                <span className="text-sm font-bold text-primary">
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <h3 className="text-sm font-bold text-card-foreground">
          Order Summary
        </h3>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-card-foreground">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="text-card-foreground">
              ${deliveryFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="text-card-foreground">
              ${serviceFee.toFixed(2)}
            </span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-success">Promo ({appliedPromo})</span>
              <span className="text-success">-${promoDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-card-foreground">Total</span>
              <span className="font-bold text-primary">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mx-5 mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h3 className="text-sm font-bold text-card-foreground">Promo Code</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            disabled={!!appliedPromo}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {appliedPromo ? (
            <button
              onClick={() => {
                setAppliedPromo(null);
                setPromoDiscount(0);
                setPromoCode("");
              }}
              className="rounded-xl bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode}
              className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mx-5 mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h3 className="text-sm font-bold text-card-foreground">
          Payment Method
        </h3>
        <div className="mt-2 space-y-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setDefaultMethod(pm.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                selectedPaymentId === pm.id
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border bg-background"
              }`}
            >
              <span className="text-lg">{pm.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  {pm.label}
                  {pm.last4 && (
                    <span className="text-muted-foreground">
                      {" "}
                      ···· {pm.last4}
                    </span>
                  )}
                </p>
              </div>
              {selectedPaymentId === pm.id && (
                <Check size={16} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-md px-5">
        <button
          onClick={handleCheckout}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg active:scale-[0.98]"
        >
          Checkout · ${grandTotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
