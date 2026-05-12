import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip, type MapViewport } from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { getHostels } from "@/api/hostels";
import { useQuery } from "@tanstack/react-query";

interface HostelMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

interface MarkerData {
  id: string;
  name: string;
  lng: number;
  lat: number;
  price?: string;
  location?: string;
}

export function HostelMap({
  center: propCenter,
  zoom: propZoom = 12,
  className = "h-[420px] w-full"
}: HostelMapProps) {
  const userRole = useAuthStore(state => state.role)
  const userHostelId = useAuthStore(state => state.hostelId)
  const navigate = useNavigate()

  const { data: hostelsData, isLoading, error } = useQuery({
    queryKey: ["hostels-for-map"],
    queryFn: async () => {
      const response = await getHostels();
      return response.data;
    },
  })

  const hostels = hostelsData || []

  const filteredHostels = useMemo(() => {
    let filtered = hostels.filter(h => h.latitude !== null && h.longitude !== null && h.latitude !== undefined && h.longitude !== undefined)
    
    if (userRole === "admin" && userHostelId) {
      filtered = filtered.filter(h => h.id === userHostelId)
    }
    
    return filtered
  }, [hostels, userRole, userHostelId])

  const markers: MarkerData[] = useMemo(() => {
    return filteredHostels.map(h => ({
      id: h.id,
      name: h.name,
      lng: h.longitude!,
      lat: h.latitude!,
      price: h.averageRating ? `Rating: ${h.averageRating.toFixed(1)}` : undefined,
      location: h.location,
    }))
  }, [filteredHostels])

  const mapCenter = useMemo((): [number, number] => {
    if (propCenter) return propCenter
    
    if (userRole === "admin" && userHostelId) {
      const adminHostel = filteredHostels.find(h => h.id === userHostelId)
      if (adminHostel && adminHostel.latitude && adminHostel.longitude) {
        return [adminHostel.longitude, adminHostel.latitude]
      }
    }
    
    if (markers.length > 0) {
      return [markers[0].lng, markers[0].lat]
    }
    
    return [-0.1276, 51.5074]
  }, [propCenter, markers, userRole, userHostelId, filteredHostels])

  const [viewport, setViewport] = useState<MapViewport>({
    center: mapCenter,
    zoom: propZoom,
    bearing: 0,
    pitch: 0,
  })

  const handleMarkerClick = (location: MarkerData) => {
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
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-destructive mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load hostels</p>
          </div>
        </div>
      ) : markers.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hostels with location data</p>
          </div>
        </div>
      ) : null}
      
      <Map
        viewport={viewport}
        onViewportChange={setViewport}
      >
        <MapControls />
        {markers.map((location) => (
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
                {location.price && (
                  <p className="text-sm text-muted-foreground">{location.price}</p>
                )}
                {location.location && (
                  <p className="text-xs text-muted-foreground">{location.location}</p>
                )}
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </Card>
  );
}