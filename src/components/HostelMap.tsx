import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, type MapViewport } from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

interface HostelMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const dummyLocations = [
  { id: 1, name: "Downtown Hostel", lng: -0.1276, lat: 51.5074, price: "$25/night" },
  { id: 2, name: "Westside Backpackers", lng: -0.1476, lat: 51.5174, price: "$20/night" },
  { id: 3, name: "East End Stays", lng: -0.1076, lat: 51.5274, price: "$18/night" },
];

export function HostelMap({
  center = [-0.1276, 51.5074],
  zoom = 12,
  className = "h-[420px] w-full"
}: HostelMapProps) {
  const [viewport, setViewport] = useState<MapViewport>({
    center,
    zoom,
    bearing: 0,
    pitch: 0,
  });
  const navigate = useNavigate();

  const handleMarkerClick = (location: (typeof dummyLocations)[number]) => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!isAuth) {
      toast.error("Please log in to view hostel details");
      navigate(`/login?redirect=${encodeURIComponent(`/find/${location.id}/room`)}`);
      return;
    }
    navigate(`/find/${location.id}/room`);
  };

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <Map
        viewport={viewport}
        onViewportChange={setViewport}
      >
        <MapControls />
        {dummyLocations.map((location) => (
          <MapMarker key={location.id} longitude={location.lng} latitude={location.lat}>
            <MarkerContent>
              <div
                className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                onClick={() => handleMarkerClick(location)}
              >
                <MapPin className="w-8 h-8 fill-primary/20 stroke-[1.5]" />
              </div>
            </MarkerContent>
            <MarkerTooltip>{location.name}</MarkerTooltip>
            <MarkerPopup className="min-w-[150px]">
              <div className="space-y-1">
                <p className="font-semibold">{location.name}</p>
                <p className="text-sm text-muted-foreground">{location.price}</p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </Card>
  );
}
