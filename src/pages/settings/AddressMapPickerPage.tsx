import { useState, type MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import { mockAddressSearchPlaces } from "@/data/mockData";
import type { AddressSearchPlace } from "@/data/mockData";
import addressMapImage from "@/assets/address.jpg";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const MAP_COORDINATE_BOUNDS = {
  minLatitude: 13.648,
  maxLatitude: 13.661,
  minLongitude: 102.556,
  maxLongitude: 102.5695,
};

const FALLBACK_PLACE: AddressSearchPlace = {
  id: "fallback-place",
  title: "PPP3 Office",
  subtitle: "Border canal road, Lum Village, Krong Poipet",
  zone: "Poipet Border Canal",
  latitude: 13.6507,
  longitude: 102.5605,
  etaMinutes: "10-15 min",
  markerX: 35,
  markerY: 76,
};

const AddressMapPickerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");
  const select = searchParams.get("select");

  const flowPath = (path: string) => {
    const params = new URLSearchParams();
    if (select === "1") params.set("select", "1");
    if (from) params.set("from", from);
    return params.toString() ? `${path}?${params.toString()}` : path;
  };

  const firstPlace = mockAddressSearchPlaces[0] ?? FALLBACK_PLACE;
  const [activePlaceId, setActivePlaceId] = useState(
    mockAddressSearchPlaces[0]?.id ?? firstPlace.id,
  );
  const [customPlace, setCustomPlace] = useState<AddressSearchPlace | null>(
    null,
  );

  const activePlace =
    mockAddressSearchPlaces.find((place) => place.id === activePlaceId) ??
    firstPlace;

  const selectedPlace = customPlace ?? activePlace;

  const toMockCoordinate = (markerX: number, markerY: number) => {
    const latRange =
      MAP_COORDINATE_BOUNDS.maxLatitude - MAP_COORDINATE_BOUNDS.minLatitude;
    const lngRange =
      MAP_COORDINATE_BOUNDS.maxLongitude - MAP_COORDINATE_BOUNDS.minLongitude;

    const latitude =
      MAP_COORDINATE_BOUNDS.maxLatitude - (markerY / 100) * latRange;
    const longitude =
      MAP_COORDINATE_BOUNDS.minLongitude + (markerX / 100) * lngRange;

    return { latitude, longitude };
  };

  const getNearestPlace = (markerX: number, markerY: number) =>
    mockAddressSearchPlaces.reduce((nearest, place) => {
      const nearestDistance = Math.hypot(
        nearest.markerX - markerX,
        nearest.markerY - markerY,
      );
      const placeDistance = Math.hypot(place.markerX - markerX, place.markerY - markerY);
      return placeDistance < nearestDistance ? place : nearest;
    }, firstPlace);

  const handleSelectSavedPlace = (placeId: string) => {
    setCustomPlace(null);
    setActivePlaceId(placeId);
  };

  const handleMapPin = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const markerX = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const markerY = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    const nearestPlace = getNearestPlace(markerX, markerY);
    const coords = toMockCoordinate(markerX, markerY);

    setCustomPlace({
      ...nearestPlace,
      id: `custom-pin-${Date.now()}`,
      title: "Pinned Location",
      subtitle: `Near ${nearestPlace.title}`,
      latitude: coords.latitude,
      longitude: coords.longitude,
      markerX,
      markerY,
    });
  };

  return (
    <div className="flex flex-col pb-24">
      <div className="px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Pin Location</h1>
        </div>
      </div>

      <div className="px-5">
        <div
          onClick={handleMapPin}
          className="relative h-[360px] cursor-crosshair overflow-hidden rounded-3xl border border-border bg-muted"
        >
          <img
            src={addressMapImage}
            alt="Poipet mock map for address pinning"
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute left-5 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white">
            Mock Map · Poipet Border
          </div>

          {mockAddressSearchPlaces.map((place) => {
            const isActive = !customPlace && place.id === activePlaceId;
            return (
              <button
                key={place.id}
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelectSavedPlace(place.id);
                }}
                className={`absolute -translate-x-1/2 -translate-y-full rounded-full ${
                  isActive ? "scale-110" : "scale-100 opacity-80"
                }`}
                style={{
                  left: `${place.markerX}%`,
                  top: `${place.markerY}%`,
                }}
                aria-label={`Select ${place.title}`}
              >
                <div
                  className={`rounded-full p-1.5 shadow-md ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-card"
                  }`}
                >
                  <MapPin size={14} />
                </div>
              </button>
            );
          })}

          {customPlace && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              style={{
                left: `${customPlace.markerX}%`,
                top: `${customPlace.markerY}%`,
              }}
            >
              <div className="rounded-full bg-rose-600 p-1.5 text-white shadow-lg">
                <MapPin size={14} />
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
            Tap map to place your exact pin
          </div>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Selected Pin
          </p>
          <h2 className="mt-1 text-base font-bold text-card-foreground">
            {selectedPlace.title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {selectedPlace.subtitle}
          </p>
          <p className="mt-2 text-xs font-medium text-primary">
            Zone: {selectedPlace.zone} · ETA {selectedPlace.etaMinutes}
          </p>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {mockAddressSearchPlaces.map((place) => (
            <button
              key={`chip-${place.id}`}
              onClick={() => handleSelectSavedPlace(place.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                !customPlace && place.id === activePlaceId
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground shadow-sm"
              }`}
            >
              {place.title}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 mx-auto w-full max-w-md px-5">
        <button
          onClick={() =>
            navigate(flowPath("/settings/addresses/new"), {
              state: { place: selectedPlace },
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg active:scale-[0.98]"
        >
          Confirm Pin
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AddressMapPickerPage;
