import { useState, useMemo, useEffect, useId, useRef } from "react";
import { AppMap } from "./AppMap";
import { HostelMarker } from "./HostelMarker";
import { useMap, MapPopup } from "@/components/ui/map";
import { MapPin, Navigation } from "lucide-react";
import { Hostel } from "@/helper/types/types";

interface HostelMapProps {
  hostels: Hostel[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showControls?: boolean;
  onMarkerClick?: (hostel: Hostel) => void;
  onViewportChange?: (viewport: { center: [number, number]; zoom: number; bearing: number; pitch: number }) => void;
  viewport?: { center: [number, number]; zoom: number; bearing: number; pitch: number };
  focusedHostelId?: string | null;
  autoFit?: boolean;
}

const GHANA_CENTER: [number, number] = [-1.0232, 7.9465]; // [lng, lat]
const DEFAULT_ZOOM = 6;

function HostelsLayer({ hostels, onMarkerClick, focusedHostelId }: { hostels: Hostel[], onMarkerClick?: (hostel: Hostel) => void, focusedHostelId?: string | null }) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `hostels-source-${id}`;
  const layerId = `hostels-layer-${id}`;
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const hostelsRef = useRef(hostels);
  hostelsRef.current = hostels;

  useEffect(() => {
    if (focusedHostelId) {
      const hostel = hostels.find(h => h.id === focusedHostelId);
      if (hostel) setSelectedHostel(hostel);
    }
  }, [focusedHostelId, hostels]);

  const geojsonData = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: hostels.map(h => ({
        type: "Feature" as const,
        properties: {
          id: h.id,
          hostelId: h.id,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            (h.longitude ?? (h as any).lng)!,
            (h.latitude ?? (h as any).lat)!
          ]
        }
      }))
    };
  }, [hostels]);

  // Setup effect: create icon, source, layer, and event handlers once
  useEffect(() => {
    if (!map || !isLoaded) return;

    const iconId = 'hostel-icon';
    if (!map.hasImage(iconId)) {
      const img = new Image(36, 36);
      img.onload = () => {
        if (!map.hasImage(iconId)) {
          map.addImage(iconId, img);
        }
      };
      const svg = `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="16" fill="#e11d48" stroke="#ffffff" stroke-width="2.5"/><path d="M10 21v-4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v4M10 24v-3M26 24v-3M10 15V13c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2M10 21h16" stroke="#ffffff" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: geojsonData,
    });

    map.addLayer({
      id: layerId,
      type: "symbol",
      source: sourceId,
      layout: {
        "icon-image": iconId,
        "icon-size": 1,
        "icon-allow-overlap": true
      },
    });

    const handleClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const clickedId = feature.properties?.hostelId;
      const hostel = hostelsRef.current.find(h => h.id === clickedId);
      if (hostel) {
        setSelectedHostel(hostel);
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      map.off("click", layerId, handleClick);
      map.off("mouseenter", layerId, handleMouseEnter);
      map.off("mouseleave", layerId, handleMouseLeave);

      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
  }, [map, isLoaded, sourceId, layerId]);

  // Data update effect: update GeoJSON data without destroying/recreating the layer
  useEffect(() => {
    if (!map || !isLoaded) return;
    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(geojsonData);
    }
  }, [map, isLoaded, sourceId, geojsonData]);

  return (
    <>
      {selectedHostel && (
        <MapPopup
          longitude={(selectedHostel.longitude ?? (selectedHostel as any).lng)!}
          latitude={(selectedHostel.latitude ?? (selectedHostel as any).lat)!}
          onClose={() => setSelectedHostel(null)}
          closeOnClick={false}
          focusAfterOpen={false}
          offset={15}
          closeButton
        >
          <button 
            type="button"
            className="flex flex-col gap-2 min-w-32 cursor-pointer p-1 text-left bg-transparent border-none appearance-none w-full" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onMarkerClick) onMarkerClick(selectedHostel);
            }}
          >
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center border shrink-0">
                 {(selectedHostel as any).logoUrl ? (
                   <img src={(selectedHostel as any).logoUrl} alt="Logo" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-xs font-semibold uppercase">{(selectedHostel as any).name?.charAt(0) || 'H'}</span>
                 )}
               </div>
               <p className="font-medium text-sm leading-tight hover:underline line-clamp-2">{(selectedHostel as any).name}</p>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
               <MapPin className="w-3 h-3" /> Click to view details
            </div>
          </button>
        </MapPopup>
      )}
    </>
  );
}

function MapAutoFit({ hostels }: { hostels: Hostel[] }) {
  const { map, isLoaded } = useMap();
  const signature = hostels.map((h) => h.id).sort().join("|");

  useEffect(() => {
    if (!map || !isLoaded || hostels.length === 0) return;

    const lats = hostels.map((h) => h.latitude!);
    const lngs = hostels.map((h) => h.longitude!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 40, maxZoom: 14, animate: true, duration: 600 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded, signature]);

  return null;
}

// The multi-hostel map (we'll keep it interactive for browsing)
export function HostelMap({
  hostels,
  center = GHANA_CENTER,
  zoom = DEFAULT_ZOOM,
  height = "400px",
  showControls = true,
  onMarkerClick,
  onViewportChange,
  viewport: externalViewport,
  focusedHostelId,
  autoFit = false,
}: HostelMapProps) {
  const hostelsWithCoords = useMemo(
    () => hostels.filter((h: any) => {
      const lat = h.latitude ?? h.lat;
      const lng = h.longitude ?? h.lng;
      return lat !== undefined && lat !== null && lng !== undefined && lng !== null;
    }),
    [hostels]
  );

  const [internalViewport, setInternalViewport] = useState({
    center: center,
    zoom: zoom,
    bearing: 0,
    pitch: 0,
  });

  const activeViewport = externalViewport || internalViewport;
  const activeSetViewport = onViewportChange || setInternalViewport;

  // Sync internal viewport if center/zoom props change and we're not controlled
  useEffect(() => {
    if (!externalViewport) {
      setInternalViewport(prev => ({
        ...prev,
        center: center,
        zoom: zoom
      }));
    }
  }, [center, zoom, externalViewport]);

  return (
    <div className="rounded-lg overflow-hidden border relative" style={{ height }}>
      <AppMap 
        viewport={activeViewport} 
        onViewportChange={activeSetViewport} 
        showControls={showControls}
        height={height}
      >
        <HostelsLayer hostels={hostelsWithCoords} onMarkerClick={onMarkerClick} focusedHostelId={focusedHostelId} />
        {autoFit && <MapAutoFit hostels={hostelsWithCoords} />}
      </AppMap>

      {hostelsWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] pointer-events-none">
          <div className="bg-card/90 border shadow-lg rounded-lg p-4 text-center pointer-events-auto">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium">No hostels found in this area</p>
            <p className="text-xs text-muted-foreground mt-1">Try zooming out or searching another area</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SingleHostelMapProps {
  hostel: { latitude?: number | null; longitude?: number | null };
  height?: string;
}

export function SingleHostelMap({
  hostel,
  height = "250px",
}: SingleHostelMapProps) {
  if (!hostel.latitude || !hostel.longitude) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg border"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Location not available</p>
        </div>
      </div>
    );
  }

  const viewport = {
    center: [hostel.longitude, hostel.latitude] as [number, number],
    zoom: 14,
    bearing: 0,
    pitch: 0,
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hostel.latitude},${hostel.longitude}`;

  return (
    <div className="relative rounded-lg overflow-hidden border group">
      <AppMap 
        viewport={viewport} 
        interactive={false} // completely static map per instructions
        showControls={false}
        height={height}
      >
        <HostelMarker
          markerPos={{ lng: hostel.longitude, lat: hostel.latitude }}
          viewportCenter={viewport.center}
          draggable={false}
        />
      </AppMap>
      
      {/* Premium Google Maps Redirect Button Overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-105 active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

interface HostelMapCardProps {
  hostel: Hostel;
  onClick?: () => void;
}

export function HostelMapCard({ hostel, onClick }: HostelMapCardProps) {
  if (!hostel.latitude || !hostel.longitude) {
    return (
      <div
        className="bg-muted rounded-lg border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
        style={{ height: "150px" }}
        onClick={onClick}
      >
        <div className="text-center text-muted-foreground">
          <MapPin className="w-5 h-5 mx-auto mb-1 opacity-50" />
          <p className="text-xs">View on map</p>
        </div>
      </div>
    );
  }

  const viewport = {
    center: [hostel.longitude, hostel.latitude] as [number, number],
    zoom: 13,
    bearing: 0,
    pitch: 0,
  };

  return (
    <div
      className="rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity relative"
      onClick={onClick}
      style={{ height: "150px" }}
    >
      <AppMap 
        viewport={viewport} 
        interactive={false} 
        showControls={false}
        height="150px"
      >
        <HostelMarker
          markerPos={{ lng: hostel.longitude, lat: hostel.latitude }}
          viewportCenter={viewport.center}
          draggable={false}
        />
      </AppMap>
    </div>
  );
}