/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  User,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Upload,
  CheckCircle,
  Camera,
  FileText,
  Info,
  Landmark,
  BadgePercent,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// ─── Foodpanda-style constants for Cambodia ─────────────────────────────────

const cuisineTypes = [
  "Khmer",
  "Chinese",
  "Vietnamese",
  "Thai",
  "Japanese",
  "Korean",
  "Western",
  "Indian",
  "Noodles",
  "Street Food",
  "Seafood",
  "BBQ & Grill",
  "Bakery & Desserts",
  "Café & Drinks",
  "Vegetarian / Vegan",
  "Fast Food",
] as const;

const phnomPenhAreas = [
  "BKK1 (Boeung Keng Kang 1)",
  "BKK2 (Boeung Keng Kang 2)",
  "BKK3 (Boeung Keng Kang 3)",
  "Toul Tom Poung (Russian Market)",
  "Chamkarmon",
  "Daun Penh",
  "7 Makara",
  "Toul Kork",
  "Chroy Changvar",
  "Sen Sok",
  "Mean Chey",
  "Phsar Kandal",
  "Riverside (Sisowath Quay)",
  "Olympic / Orussey",
  "Phsar Chas",
  "Boeung Trabek",
  "Other (specify below)",
] as const;

const cambodianBanks = [
  "ABA Bank",
  "ACLEDA Bank",
  "Wing (Wing Bank)",
  "Canadia Bank",
  "Prince Bank",
  "Sathapana Bank",
  "AMK Microfinance",
  "BRED Bank Cambodia",
  "Phillip Bank",
  "Other",
] as const;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const TOTAL_STEPS = 5;

const COMMISSION_RATE = 30; // Foodpanda Cambodia typical commission %

// ─── Component ──────────────────────────────────────────────────────────────

const RestaurantRegisterPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Contact / Owner
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [nationalId, setNationalId] = useState("");

  // Step 2 — Restaurant Details
  const [restaurantName, setRestaurantName] = useState("");
  const [cuisineSelected, setCuisineSelected] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [branches, setBranches] = useState("1");
  const [hasDeliveryService, setHasDeliveryService] = useState<string>("");
  const [description, setDescription] = useState("");

  // Step 3 — Operating Hours
  const [operatingDays, setOperatingDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [prepTime, setPrepTime] = useState("20");
  const [deliveryRadius, setDeliveryRadius] = useState("5");

  // Step 4 — Bank & Business
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [businessPatent, setBusinessPatent] = useState("");
  const [vatTin, setVatTin] = useState("");

  // Step 5 — Documents (mock uploads)
  const [docs, setDocs] = useState({
    businessLicense: false,
    ownerId: false,
    storefront: false,
    menuPhoto: false,
    foodCert: false,
  });
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCommission, setAgreedCommission] = useState(false);
  const applicationId = `NE-2026-${(ownerPhone.replace(/\D/g, "").slice(-4) || "1001").padStart(4, "0")}`;

  // ─── Validation ─────────────────────────────────────────────────────────

  const validators: Record<number, () => boolean> = {
    1: () => {
      if (!ownerName.trim()) return fail("Please enter your full name");
      if (!ownerPhone.trim()) return fail("Please enter your phone number");
      if (!ownerEmail.trim()) return fail("Please enter your email address");
      if (!nationalId.trim())
        return fail("Please enter your National ID / Passport number");
      return true;
    },
    2: () => {
      if (!restaurantName.trim()) return fail("Please enter restaurant name");
      if (cuisineSelected.length === 0)
        return fail("Please select at least one cuisine type");
      if (!area) return fail("Please select your area");
      if (!fullAddress.trim()) return fail("Please enter the full address");
      if (!restaurantPhone.trim())
        return fail("Please enter restaurant phone number");
      return true;
    },
    3: () => {
      if (operatingDays.length === 0)
        return fail("Please select operating days");
      if (!openTime || !closeTime)
        return fail("Please set opening and closing times");
      return true;
    },
    4: () => {
      if (!bankName) return fail("Please select your bank");
      if (!accountName.trim()) return fail("Please enter account holder name");
      if (!accountNumber.trim()) return fail("Please enter account number");
      return true;
    },
  };

  function fail(msg: string) {
    toast.error(msg);
    return false;
  }

  const handleNext = () => {
    const validate = validators[step];
    if (!validate || validate()) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!docs.businessLicense || !docs.ownerId || !docs.storefront) {
      return fail("Please upload all required documents");
    }
    if (!agreedTerms) return fail("Please agree to the Terms & Conditions");
    if (!agreedCommission) return fail("Please agree to the Commission Terms");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
    toast.success("Application submitted successfully! 🎉");
  };

  // ─── Mock upload helper ─────────────────────────────────────────────────

  const mockUpload = (key: keyof typeof docs, label: string) => {
    setDocs((prev) => ({ ...prev, [key]: true }));
    toast.success(`${label} uploaded`);
  };

  const toggleCuisine = (c: string) => {
    setCuisineSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const toggleDay = (d: string) => {
    setOperatingDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  // ─── Success Screen ────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Application Submitted! 🇰🇭
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
          Thank you, <span className="font-semibold">{ownerName}</span>! Your
          partner application for{" "}
          <span className="font-semibold">{restaurantName}</span> is under
          review.
        </p>

        {/* Application ID */}
        <div className="mt-5 rounded-xl bg-primary/5 px-6 py-3">
          <p className="text-xs text-muted-foreground">Application ID</p>
          <p className="text-lg font-bold tracking-wider text-primary">
            {applicationId}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-6 w-full space-y-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">
            What happens next?
          </h3>
          {[
            {
              step: "1",
              title: "Application Review",
              desc: "Our team reviews your documents (1-3 business days)",
            },
            {
              step: "2",
              title: "Verification Call",
              desc: `We'll call ${ownerPhone} to verify details`,
            },
            {
              step: "3",
              title: "Account Setup",
              desc: "Set up your menu, prices & photos on the partner portal",
            },
            {
              step: "4",
              title: "Go Live!",
              desc: "Start receiving orders from thousands of Cambodians 🎉",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact support */}
        <div className="mt-4 rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact partner support
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            +855 23 999 888
          </p>
          <p className="text-xs text-muted-foreground">
            partners@nhamey.com.kh
          </p>
        </div>

        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground active:scale-[0.98]"
          >
            Back to Login
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
          >
            Explore App
          </button>
        </div>
      </div>
    );
  }

  // ─── Step Labels ────────────────────────────────────────────────────────

  const stepLabels = ["Contact", "Restaurant", "Hours", "Bank", "Documents"];

  // ─── Input helper ───────────────────────────────────────────────────────

  const InputField = ({
    label,
    required = true,
    icon: Icon,
    placeholder,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    required?: boolean;
    icon: React.ComponentType<{ size: number; className: string }>;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
  }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <Icon size={18} className="shrink-0 text-muted-foreground" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );

  // ─── Doc upload button ──────────────────────────────────────────────────

  const UploadButton = ({
    done,
    label,
    sublabel,
    onUpload,
    icon: Icon = Upload,
    requiredTag = true,
  }: {
    done: boolean;
    label: string;
    sublabel: string;
    onUpload: () => void;
    icon?: React.ComponentType<{ size: number; className: string }>;
    requiredTag?: boolean;
  }) => (
    <button
      onClick={onUpload}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all active:scale-[0.98] ${
        done
          ? "border-green-300 bg-green-50"
          : "border-dashed border-border bg-card"
      }`}
    >
      {done ? (
        <CheckCircle size={20} className="shrink-0 text-green-600" />
      ) : (
        <Icon size={20} className="shrink-0 text-muted-foreground" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-card-foreground">
          {label}
          {requiredTag && !done && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </button>
  );

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-12">
      {/* Header */}
      <button onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}>
        <ArrowLeft size={22} className="text-foreground" />
      </button>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Store size={24} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Become a Partner
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Register your restaurant on Nham Ey — Cambodia&apos;s food platform 🇰🇭
        </p>
      </div>

      {/* ── Progress Steps ─────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
            <span
              className={`text-[9px] ${s <= step ? "font-semibold text-primary" : "text-muted-foreground"}`}
            >
              {stepLabels[s - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1 — Contact / Owner Information
         ══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="mt-7 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Owner / Contact Information
          </h2>

          <InputField
            label="Full Name (Khmer or English)"
            icon={User}
            placeholder="e.g. វណ្ណ សុខា / Sokha Vann"
            value={ownerName}
            onChange={setOwnerName}
          />
          <InputField
            label="Phone Number"
            icon={Phone}
            placeholder="+855 12 345 678"
            value={ownerPhone}
            onChange={setOwnerPhone}
            type="tel"
          />
          <InputField
            label="Email Address"
            icon={FileText}
            placeholder="owner@email.com"
            value={ownerEmail}
            onChange={setOwnerEmail}
            type="email"
          />
          <InputField
            label="National ID / Passport No."
            icon={CreditCard}
            placeholder="e.g. 012345678"
            value={nationalId}
            onChange={setNationalId}
          />

          {/* Info box */}
          <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 p-3.5">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
            <p className="text-xs leading-relaxed text-blue-700">
              We collect your ID for KYC verification as required by Cambodian
              regulations. Your data is encrypted and secure.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Restaurant Details
         ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="mt-7 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Restaurant Details
          </h2>

          <InputField
            label="Restaurant Name"
            icon={Store}
            placeholder="e.g. Phnom Penh Noodle House"
            value={restaurantName}
            onChange={setRestaurantName}
          />

          {/* Cuisine multi-select */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Cuisine Type (select all that apply){" "}
              <span className="text-destructive">*</span>
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {cuisineTypes.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                    cuisineSelected.includes(c)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Area dropdown */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Area / District <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-1.5">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-11 pr-10 text-sm text-card-foreground outline-none"
              >
                <option value="">Select area in Phnom Penh</option>
                {phnomPenhAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <InputField
            label="Full Address"
            icon={MapPin}
            placeholder="No. 12, Street 63, BKK1, Phnom Penh"
            value={fullAddress}
            onChange={setFullAddress}
          />

          <InputField
            label="Restaurant Phone"
            icon={Phone}
            placeholder="+855 23 456 789"
            value={restaurantPhone}
            onChange={setRestaurantPhone}
            type="tel"
          />

          {/* Number of branches */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Number of Branches
            </label>
            <div className="mt-1.5 flex gap-2">
              {["1", "2-3", "4-10", "10+"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBranches(b)}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                    branches === b
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Already using delivery? */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Currently using a delivery service?
            </label>
            <div className="mt-1.5 flex gap-2">
              {["None", "Own riders", "Nham24", "Grab", "Other"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHasDeliveryService(opt)}
                  className={`flex-1 rounded-xl border py-2.5 text-[11px] font-medium transition-all active:scale-[0.97] ${
                    hasDeliveryService === opt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Brief Description (optional)
            </label>
            <div className="mt-1.5 rounded-xl border border-border bg-card px-4 py-3">
              <textarea
                rows={2}
                placeholder="What makes your restaurant special?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3 — Operating Hours & Delivery
         ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="mt-7 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Operating Hours & Delivery
          </h2>

          {/* Days */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Operating Days <span className="text-destructive">*</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {daysOfWeek.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                    operatingDays.includes(d)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time pickers */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                Opening Time <span className="text-destructive">*</span>
              </label>
              <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <Clock size={18} className="text-muted-foreground" />
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-card-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                Closing Time <span className="text-destructive">*</span>
              </label>
              <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <Clock size={18} className="text-muted-foreground" />
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-card-foreground outline-none"
                />
              </div>
            </div>
          </div>

          {/* Average prep time */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Average Preparation Time (minutes)
            </label>
            <div className="mt-1.5 flex gap-2">
              {["10", "15", "20", "30", "45", "60"].map((t) => (
                <button
                  key={t}
                  onClick={() => setPrepTime(t)}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                    prepTime === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          {/* Delivery radius */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Delivery Radius (km)
            </label>
            <div className="mt-1.5 flex gap-2">
              {["3", "5", "7", "10", "15"].map((r) => (
                <button
                  key={r}
                  onClick={() => setDeliveryRadius(r)}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all active:scale-[0.97] ${
                    deliveryRadius === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground"
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3.5">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed text-amber-800">
              You&apos;ll be able to update operating hours and manage holiday
              closures from your owner dashboard anytime.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4 — Bank & Business Registration
         ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="mt-7 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Bank Account & Business Details
          </h2>
          <p className="text-xs text-muted-foreground">
            For weekly settlement payouts (every Monday) 💰
          </p>

          {/* Bank select */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Bank <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-1.5">
              <Landmark
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-card py-3 pl-11 pr-10 text-sm text-card-foreground outline-none"
              >
                <option value="">Select your bank</option>
                {cambodianBanks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <InputField
            label="Account Holder Name"
            icon={User}
            placeholder="As shown on bank account"
            value={accountName}
            onChange={setAccountName}
          />
          <InputField
            label="Account Number"
            icon={CreditCard}
            placeholder="e.g. 000 123 456 789"
            value={accountNumber}
            onChange={setAccountNumber}
          />

          <div className="my-2 h-px bg-border" />

          <InputField
            label="Business Patent / License No."
            icon={FileText}
            placeholder="e.g. BP-2026-12345"
            value={businessPatent}
            onChange={setBusinessPatent}
            required={false}
          />
          <InputField
            label="VAT / TIN (optional)"
            icon={FileText}
            placeholder="e.g. K001-12345678"
            value={vatTin}
            onChange={setVatTin}
            required={false}
          />

          {/* Settlement info */}
          <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-foreground">
              💳 Settlement Schedule
            </h3>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                • Payouts processed every <strong>Monday</strong>
              </p>
              <p>
                • Funds deposited to your{" "}
                <strong>{bankName || "selected bank"}</strong> within 1-2
                business days
              </p>
              <p>
                • Minimum payout: <strong>$10.00 USD</strong>
              </p>
              <p>
                • Settlement currency: <strong>USD (or KHR equivalent)</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5 — Documents, Commission & Agreement
         ══════════════════════════════════════════════════════════════════ */}
      {step === 5 && (
        <div className="mt-7 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">
            Upload Documents
          </h2>

          <div className="space-y-2.5">
            <UploadButton
              done={docs.businessLicense}
              label="Business License / Patent"
              sublabel={
                docs.businessLicense
                  ? "patent_2026.pdf ✓"
                  : "Photo or PDF of your business license"
              }
              onUpload={() => mockUpload("businessLicense", "Business license")}
              icon={Upload}
            />
            <UploadButton
              done={docs.ownerId}
              label="Owner ID (National ID / Passport)"
              sublabel={
                docs.ownerId ? "national_id.jpg ✓" : "Front & back of your ID"
              }
              onUpload={() => mockUpload("ownerId", "Owner ID")}
              icon={CreditCard}
            />
            <UploadButton
              done={docs.storefront}
              label="Storefront Photo"
              sublabel={
                docs.storefront
                  ? "storefront.jpg ✓"
                  : "Clear photo of your restaurant entrance"
              }
              onUpload={() => mockUpload("storefront", "Storefront photo")}
              icon={Camera}
            />
            <UploadButton
              done={docs.menuPhoto}
              label="Menu Photo (optional)"
              sublabel={
                docs.menuPhoto ? "menu.jpg ✓" : "Upload existing menu photos"
              }
              onUpload={() => mockUpload("menuPhoto", "Menu photo")}
              requiredTag={false}
            />
            <UploadButton
              done={docs.foodCert}
              label="Food Safety Certificate (optional)"
              sublabel={
                docs.foodCert
                  ? "food_cert.pdf ✓"
                  : "If available, helps expedite approval"
              }
              onUpload={() => mockUpload("foodCert", "Food safety cert")}
              icon={FileText}
              requiredTag={false}
            />
          </div>

          {/* Commission Agreement */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <BadgePercent size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Commission Structure
              </h3>
            </div>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                <span>Platform commission</span>
                <span className="text-lg font-bold text-primary">
                  {COMMISSION_RATE}%
                </span>
              </div>
              <p>• Commission applies to each completed delivery order</p>
              <p>
                • Your restaurant keeps {100 - COMMISSION_RATE}% of each order
              </p>
              <p>
                • Dine-in & pickup orders: <strong>lower rate (15%)</strong>
              </p>
              <p>• No monthly fees, setup fees, or hidden charges</p>
              <p>• Promotions funded by Nham Ey are at no cost to you</p>
            </div>
          </div>

          {/* Application Summary */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground">
              📋 Application Summary
            </h3>
            <div className="mt-3 space-y-2">
              {[
                { label: "Owner", value: ownerName },
                { label: "Phone", value: ownerPhone },
                { label: "Restaurant", value: restaurantName },
                {
                  label: "Cuisine",
                  value: cuisineSelected.join(", ") || "—",
                },
                { label: "Area", value: area || "—" },
                { label: "Address", value: fullAddress },
                {
                  label: "Hours",
                  value: `${openTime} – ${closeTime}`,
                },
                { label: "Prep Time", value: `${prepTime} min` },
                {
                  label: "Bank",
                  value: bankName
                    ? `${bankName} ****${accountNumber.slice(-4)}`
                    : "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="max-w-[55%] text-right text-xs font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
              <input
                type="checkbox"
                checked={agreedCommission}
                onChange={(e) => setAgreedCommission(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <span className="text-xs leading-relaxed text-muted-foreground">
                I agree to the <strong>{COMMISSION_RATE}% commission</strong> on
                delivery orders and <strong>15% on dine-in/pickup</strong>{" "}
                orders as outlined above.
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <span className="text-xs leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <button
                  onClick={() => navigate("/terms")}
                  className="font-semibold text-primary"
                >
                  Partner Terms & Conditions
                </button>{" "}
                and{" "}
                <button
                  onClick={() => navigate("/privacy")}
                  className="font-semibold text-primary"
                >
                  Privacy Policy
                </button>
                . I confirm the information is accurate and I am authorized to
                register this restaurant.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Buttons ──────────────────────────────────── */}
      <div className="mt-auto flex gap-3 pt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground active:scale-[0.98]"
          >
            Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={handleNext}
            className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !agreedTerms || !agreedCommission}
            className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>

      {/* Login link */}
      <div className="mt-5 text-center">
        <p className="text-xs text-muted-foreground">
          Already a partner?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-primary"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegisterPage;
