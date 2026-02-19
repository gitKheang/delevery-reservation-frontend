import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Crosshair,
  MapPinned,
  Clock3,
  ChevronRight,
} from "lucide-react";
import { mockAddressSearchPlaces } from "@/data/mockData";
import type { AddressSearchPlace } from "@/data/mockData";

const AddressSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const from = searchParams.get("from");
  const select = searchParams.get("select");

  const flowPath = (path: string) => {
    const params = new URLSearchParams();
    if (select === "1") params.set("select", "1");
    if (from) params.set("from", from);
    return params.toString() ? `${path}?${params.toString()}` : path;
  };

  const filteredPlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockAddressSearchPlaces;
    return mockAddressSearchPlaces.filter((place) => {
      const haystack = `${place.title} ${place.subtitle} ${place.zone}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const recentPlaces = mockAddressSearchPlaces.slice(0, 3);

  const goToAddressForm = (place: AddressSearchPlace) => {
    navigate(flowPath("/settings/addresses/new"), { state: { place } });
  };

  return (
    <div className="flex flex-col pb-28">
      <div className="px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Find Address</h1>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search street, building, area..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-3 px-5">
        <button
          onClick={() => goToAddressForm(mockAddressSearchPlaces[0])}
          className="flex w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Crosshair size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              Use Current Location
            </p>
            <p className="text-xs text-muted-foreground">
              Auto-select nearest mock Poipet delivery point
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate(flowPath("/settings/addresses/map"))}
          className="flex w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <MapPinned size={17} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">
              Pin Location on Map
            </p>
            <p className="text-xs text-muted-foreground">
              Drag/select pin and confirm exact drop-off point
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>

      {query.trim() === "" && (
        <div className="mt-5 px-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Recent Places
          </h2>
          <div className="mt-2 space-y-2">
            {recentPlaces.map((place) => (
              <button
                key={`recent-${place.id}`}
                onClick={() => goToAddressForm(place)}
                className="flex w-full items-start gap-3 rounded-xl bg-card px-3 py-3 text-left shadow-sm"
              >
                <Clock3 size={14} className="mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {place.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {place.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 px-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Search Results
        </h2>
        <div className="mt-2 space-y-2">
          {filteredPlaces.map((place) => (
            <button
              key={place.id}
              onClick={() => goToAddressForm(place)}
              className="flex w-full items-start gap-3 rounded-xl bg-card px-3 py-3 text-left shadow-sm"
            >
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MapPinned size={14} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">
                  {place.title}
                </p>
                <p className="text-xs text-muted-foreground">{place.subtitle}</p>
                <p className="mt-0.5 text-[11px] font-medium text-primary">
                  Zone: {place.zone} · ETA {place.etaMinutes}
                </p>
              </div>
            </button>
          ))}
          {filteredPlaces.length === 0 && (
            <div className="rounded-xl bg-card px-4 py-5 text-center shadow-sm">
              <p className="text-sm font-medium text-card-foreground">
                No matching location in mock data
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Try another keyword or pin on map.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSearchPage;
