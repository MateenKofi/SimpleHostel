import { useState, useCallback, useRef, useEffect } from "react";
import { AppMap } from "./AppMap";
import { HostelMarker } from "./HostelMarker";
import { MarkerPosition } from "./map-utils";
import { Search, MapPin, Navigation, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
  height?: string;
  disabled?: boolean;
}

const GHANA_CENTER: [number, number] = [-1.0232, 7.9465]; // [lng, lat]
const DEFAULT_ZOOM = 10;

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  address,
  onAddressChange,
  height = "300px",
  disabled = false,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    longitude && latitude ? [longitude, latitude] : null
  );
  const [viewport, setViewport] = useState({
    center: (longitude && latitude ? [longitude, latitude] : GHANA_CENTER) as [number, number],
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition([longitude, latitude]);
      setViewport((prev) => ({
        ...prev,
        center: [longitude, latitude],
        zoom: 14,
      }));
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${searchQuery}, Ghana`
        )}&limit=1`,
        {
          headers: {
            "User-Agent": "SimpleHostel/1.0",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMarkerPosition([lng, lat]);
        setViewport((prev) => ({
          ...prev,
          center: [lng, lat],
          zoom: 14,
        }));
        onLocationChange?.(lat, lng);
        if (onAddressChange) {
          onAddressChange(data[0].display_name);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = (pos: MarkerPosition) => {
    if (disabled) return;
    
    const { lng, lat } = pos;
    setMarkerPosition([lng, lat]);
    setViewport((prev) => ({
      ...prev,
      center: [lng, lat],
      zoom: 14,
    }));
    onLocationChange?.(lat, lng);
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "SimpleHostel/1.0",
          },
        }
      );
      const data = await response.json();
      if (data?.display_name && onAddressChange) {
        onAddressChange(data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setMarkerPosition([lng, lat]);
        setViewport((prev) => ({
          ...prev,
          center: [lng, lat],
          zoom: 14,
        }));
        onLocationChange?.(lat, lng);
        reverseGeocode(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your current location. Please check your browser permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleClearLocation = () => {
    setMarkerPosition(null);
    setSearchQuery("");
    onLocationChange?.(0, 0);
    onAddressChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSearching}
            className="pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={disabled || isSearching || !searchQuery.trim()}
          className="shrink-0"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={disabled || isLocating}
          className="shrink-0"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 mr-2" />
          )}
          Current
        </Button>
      </div>

      {/* Location Status */}
      {markerPosition && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {latitude && longitude
                ? `Selected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                : "Location selected"}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearLocation}
            disabled={disabled}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Map */}
      <div className={cn("rounded-lg overflow-hidden border", disabled && "opacity-50")}>
        <AppMap
          viewport={viewport}
          onViewportChange={setViewport}
          onMapClick={handleMapClick}
          interactive={!disabled}
          height={height}
        >
          {markerPosition && (
            <HostelMarker
              markerPos={{ lng: markerPosition[0], lat: markerPosition[1] }}
              viewportCenter={viewport.center as [number, number]}
              draggable={!disabled}
              onDragEnd={handleMapClick}
            />
          )}
        </AppMap>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground">
        💡 Click on the map to pin your location or use the search to find your address
      </p>
    </div>
  );
}

interface LocationPickerInputProps {
  label?: string;
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
  error?: string;
  disabled?: boolean;
}

export function LocationPickerInput({
  label = "Location on Map",
  latitude,
  longitude,
  onLocationChange,
  address,
  onAddressChange,
  error,
  disabled = false,
}: LocationPickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} <span className="text-primary">(Optional)</span>
        </Label>
      )}
      
      {/* Selected Location Display */}
      {latitude && longitude ? (
        <div className="p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(true)}
              disabled={disabled}
            >
              Edit
            </Button>
          </div>
          {address && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{address}</p>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="w-full justify-start text-muted-foreground"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Select location on map
        </Button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Location Picker Dialog/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Select Location</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onLocationChange={onLocationChange}
                address={address}
                onAddressChange={onAddressChange}
                height="400px"
                disabled={disabled}
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => setIsOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}