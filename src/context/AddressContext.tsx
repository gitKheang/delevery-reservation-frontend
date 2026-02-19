/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { mockSavedAddresses } from "@/data/mockData";
import type { SavedAddress } from "@/data/mockData";

type CreateAddressInput = Omit<SavedAddress, "id">;
type UpdateAddressInput = Partial<Omit<SavedAddress, "id">>;

interface AddressContextType {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  selectedAddress: SavedAddress | null;
  selectAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addAddress: (input: CreateAddressInput) => SavedAddress;
  updateAddress: (id: string, updates: UpdateAddressInput) => void;
  removeAddress: (id: string) => void;
  getAddressById: (id: string) => SavedAddress | undefined;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const initialSelectedId =
  mockSavedAddresses.find((a) => a.isDefault)?.id ??
  mockSavedAddresses[0]?.id ??
  null;

const ensureOneDefault = (items: SavedAddress[]): SavedAddress[] => {
  if (items.length === 0) return items;
  if (items.some((a) => a.isDefault)) return items;
  return items.map((a, i) => ({ ...a, isDefault: i === 0 }));
};

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>(mockSavedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialSelectedId,
  );

  const selectedAddress = useMemo(() => {
    if (addresses.length === 0) return null;
    return (
      addresses.find((a) => a.id === selectedAddressId) ??
      addresses.find((a) => a.isDefault) ??
      addresses[0]
    );
  }, [addresses, selectedAddressId]);

  const selectAddress = (id: string) => {
    if (!addresses.some((a) => a.id === id)) return;
    setSelectedAddressId(id);
  };

  const setDefaultAddress = (id: string) => {
    if (!addresses.some((a) => a.id === id)) return;
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(next);
    setSelectedAddressId(id);
  };

  const addAddress = (input: CreateAddressInput): SavedAddress => {
    const shouldBeDefault = input.isDefault || addresses.length === 0;
    const nextAddress: SavedAddress = {
      ...input,
      id: `addr-${Date.now()}`,
      isDefault: shouldBeDefault,
    };

    const next = shouldBeDefault
      ? [nextAddress, ...addresses.map((a) => ({ ...a, isDefault: false }))]
      : [nextAddress, ...addresses];

    setAddresses(next);
    setSelectedAddressId(nextAddress.id);
    return nextAddress;
  };

  const updateAddress = (id: string, updates: UpdateAddressInput) => {
    if (!addresses.some((a) => a.id === id)) return;

    const wantsDefault = updates.isDefault === true;
    const updated = addresses.map((a) => {
      if (a.id === id) return { ...a, ...updates };
      if (wantsDefault) return { ...a, isDefault: false };
      return a;
    });
    const normalized = ensureOneDefault(updated);
    setAddresses(normalized);

    const isSelectedAddress = selectedAddressId === id;
    if (wantsDefault || isSelectedAddress || selectedAddressId === null) {
      setSelectedAddressId(id);
    }
  };

  const removeAddress = (id: string) => {
    if (!addresses.some((a) => a.id === id)) return;

    const next = ensureOneDefault(addresses.filter((a) => a.id !== id));
    setAddresses(next);

    if (next.length === 0) {
      setSelectedAddressId(null);
      return;
    }

    const selectedStillExists = next.some((a) => a.id === selectedAddressId);
    if (selectedStillExists) return;
    const fallback =
      next.find((a) => a.isDefault)?.id ?? next[0]?.id ?? selectedAddressId;
    setSelectedAddressId(fallback);
  };

  const getAddressById = (id: string) => addresses.find((a) => a.id === id);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddressId,
        selectedAddress,
        selectAddress,
        setDefaultAddress,
        addAddress,
        updateAddress,
        removeAddress,
        getAddressById,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within AddressProvider");
  }
  return context;
};
