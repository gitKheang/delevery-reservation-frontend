import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  House,
  BriefcaseBusiness,
  Tag,
  MapPin,
  User,
  Phone,
  NotebookPen,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAddress } from "@/context/AddressContext";
import type { AddressLabelType, AddressSearchPlace } from "@/data/mockData";

interface AddressFormLocationState {
  place?: AddressSearchPlace;
}

const AddressFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const { getAddressById, addAddress, updateAddress } = useAddress();
  const editingAddress = id ? getAddressById(id) : undefined;

  const state = (location.state ?? {}) as AddressFormLocationState;
  const selectedPlace = state.place;

  const from = searchParams.get("from");
  const select = searchParams.get("select");
  const isEditMode = Boolean(id);

  const backPath = useMemo(() => {
    if (select === "1" && from && from.startsWith("/")) return from;
    return "/settings/addresses";
  }, [from, select]);

  const initialLabelType: AddressLabelType =
    editingAddress?.labelType ?? "home";
  const [labelType, setLabelType] = useState<AddressLabelType>(initialLabelType);
  const [customLabel, setCustomLabel] = useState(
    editingAddress?.labelType === "other" ? editingAddress.label : "",
  );
  const [recipientName, setRecipientName] = useState(
    editingAddress?.recipientName ?? "Sokha Chea",
  );
  const [phone, setPhone] = useState(
    editingAddress?.phone ?? "+855 12 345 678",
  );
  const [addressLine, setAddressLine] = useState(
    editingAddress?.addressLine ??
      (selectedPlace
        ? `${selectedPlace.title}, ${selectedPlace.subtitle}`
        : ""),
  );
  const [details, setDetails] = useState(editingAddress?.details ?? "");
  const [note, setNote] = useState(editingAddress?.note ?? "");
  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault ?? false);

  if (isEditMode && !editingAddress) {
    return (
      <div className="px-5 pt-16">
        <p className="text-sm font-medium text-foreground">Address not found.</p>
        <button
          onClick={() => navigate("/settings/addresses")}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Back to Addresses
        </button>
      </div>
    );
  }

  const resolvedLabel =
    labelType === "home"
      ? "Home"
      : labelType === "work"
        ? "Work"
        : customLabel.trim() || "Other";

  const resolvedLatitude =
    editingAddress?.latitude ?? selectedPlace?.latitude ?? 13.6507;
  const resolvedLongitude =
    editingAddress?.longitude ?? selectedPlace?.longitude ?? 102.5605;
  const resolvedZone =
    editingAddress?.zone ?? selectedPlace?.zone ?? "Poipet Border Canal";

  const handleSave = () => {
    if (!addressLine.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    if (!recipientName.trim()) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    if (labelType === "other" && !customLabel.trim()) {
      toast.error("Please enter a custom label");
      return;
    }

    const payload = {
      labelType,
      label: resolvedLabel,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      details: details.trim() || undefined,
      note: note.trim() || undefined,
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
      zone: resolvedZone,
      isDefault,
    };

    if (isEditMode && id) {
      updateAddress(id, payload);
      toast.success("Address updated");
    } else {
      addAddress(payload);
      toast.success("Address saved");
    }

    navigate(backPath);
  };

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {isEditMode ? "Edit Address" : "Address Details"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          className="text-sm font-semibold text-primary"
        >
          Save
        </button>
      </div>

      <div className="space-y-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Label
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setLabelType("home")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                labelType === "home"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              <House size={13} />
              Home
            </button>
            <button
              onClick={() => setLabelType("work")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                labelType === "work"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              <BriefcaseBusiness size={13} />
              Work
            </button>
            <button
              onClick={() => setLabelType("other")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                labelType === "other"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              <Tag size={13} />
              Other
            </button>
          </div>

          {labelType === "other" && (
            <input
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Label (e.g. Parents, Friend)"
              className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          )}
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Contact
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <User size={15} className="text-muted-foreground" />
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient name"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <Phone size={15} className="text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Drop-off Address
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <MapPin size={15} className="mt-0.5 text-muted-foreground" />
              <textarea
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Street, building, area"
                rows={2}
                className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Floor / unit / landmark"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="rounded-xl bg-background px-3 py-2 text-[11px] text-muted-foreground">
              Zone: {resolvedZone} · {resolvedLatitude.toFixed(4)},{" "}
              {resolvedLongitude.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Delivery Note
          </p>
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <NotebookPen size={15} className="mt-0.5 text-muted-foreground" />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Gate code, landmarks, rider instructions..."
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => setIsDefault((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left shadow-sm ${
            isDefault ? "bg-primary/10" : "bg-card"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              Set as default address
            </p>
            <p className="text-xs text-muted-foreground">
              New orders will use {resolvedLabel.toLowerCase()} automatically.
            </p>
          </div>
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${
              isDefault ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {isDefault && <Check size={12} />}
          </div>
        </button>

        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground"
        >
          {isEditMode ? "Update Address" : "Save Address"}
        </button>
      </div>
    </div>
  );
};

export default AddressFormPage;
