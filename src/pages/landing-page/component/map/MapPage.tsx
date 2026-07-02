import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHostels } from "@/api/hostels";
import { Search, MapPin, Loader2, RefreshCw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HostelMap } from "@/components/maps/HostelMap";
import type { Hostel } from "@/helper/types/types";
import SEOHelmet from "@/components/SEOHelmet";
import { getSeoRoute } from "@/config/seo";

const GHANA_CENTER: [number, number] = [-1.0232, 7.9465];
const DEFAULT_ZOOM = 7;
const mapSeo = getSeoRoute("/map");
type MappedHostel = Hostel & {
  lat?: number;
  lng?: number;
};

const getHostelCoordinates = (hostel: MappedHostel) => ({
  lat: hostel.latitude ?? hostel.lat,
  lng: hostel.longitude ?? hostel.lng,
});

const mapJsonLd = {
  "@context": "https://schema.org",
  "@type": "Map",
  name: "Best Suit Hostel Map",
  description: "Map view for finding student hostels by location in Ghana.",
};

export default function MapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewport, setViewport] = useState({
    center: GHANA_CENTER,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [pendingBounds, setPendingBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null>(null);

  const [activeBounds, setActiveBounds] = useState<typeof pendingBounds>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [focusedHostelId, setFocusedHostelId] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const [hasInitialized, setHasInitialized] = useState(false);




  const handleCloseFocus = () => {
    setFocusedHostelId(null);
    navigate("/map", { replace: true });
  };

  // Calculate bounds from viewport
  const calculateBounds = useCallback((vp: typeof viewport) => {
    const { center, zoom } = vp;
    const lngSpan = 360 / Math.pow(2, zoom);
    const latSpan = 170 / Math.pow(2, zoom);
    return {
      minLng: center[0] - lngSpan / 2,
      maxLng: center[0] + lngSpan / 2,
      minLat: Math.max(-85, center[1] - latSpan / 2),
      maxLat: Math.min(85, center[1] + latSpan / 2),
    };
  }, []);

  // Fetch hostels:
  // - On initial load: fetch ALL (no bounds) so all Ghana hostels show up immediately
  // - After user clicks "Search this area": fetch with bounds
  const { data: hostelResponse, isLoading } = useQuery({
    queryKey: ["hostels", activeBounds],
    queryFn: async () => {
      // activeBounds is null on initial load → fetch all hostels
      const result = await getHostels(activeBounds || undefined);
      return result;
    },
  });

  // Get hostels from response, handling { data: [] } and raw array formats
  const hostels: Hostel[] = useMemo(() => {
    return hostelResponse?.data || (Array.isArray(hostelResponse) ? hostelResponse : []);
  }, [hostelResponse]);

  const hostelId = searchParams.get("hostel");
  const selectedHostel = hostelId
    ? hostels.find((h) => h.id === hostelId) ?? null
    : null;

  useEffect(() => {
    if (selectedHostel && hasInitialized && !hasMoved) {
      const { lat, lng } = getHostelCoordinates(selectedHostel);
      if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
        setViewport((prev) => ({ ...prev, center: [lng, lat], zoom: 15 }));
      }
      setFocusedHostelId(hostelId);
    }
  }, [hostelId, selectedHostel, hasInitialized, hasMoved]);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  // Update pending bounds when viewport changes (debounced)
  const handleViewportChange = useCallback((vp: typeof viewport) => {
    setViewport(vp);
    setPendingBounds(calculateBounds(vp));
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setHasMoved(true);
  }, [calculateBounds]);

  // Track initial bounds only for the "Search this area" button — do NOT auto-apply
  useEffect(() => {
    const initialBounds = calculateBounds(viewport);
    setPendingBounds(initialBounds);
    // Do NOT setActiveBounds here — we want to fetch ALL hostels on first load
  }, [calculateBounds, viewport]);

  // Handle "Search this area" button click
  const handleSearchArea = useCallback(() => {
    if (pendingBounds) {
      setActiveBounds(pendingBounds);
      setHasMoved(false);
    }
  }, [pendingBounds]);

  const handleMarkerClick = useCallback((hostel: Hostel) => {
    navigate(`/find/${hostel.id}/room`);
  }, [navigate]);

  const showSearchButton = hasMoved && !isLoading;

  // Filter hostels with coordinates and search query
  const filteredHostels = useMemo(
    () => hostels.filter((h) => {
      const { lat, lng } = getHostelCoordinates(h);
      const hasCoords = lat !== undefined && lat !== null && lng !== undefined && lng !== null;
      
      if (!hasCoords) return false;
      
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      const name = (h.name || "").toLowerCase();
      const address = (h.address || "").toLowerCase();
      const location = (h.location || "").toLowerCase();
      
      return name.includes(query) || address.includes(query) || location.includes(query);
    }),
    [hostels, searchQuery]
  );



  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <SEOHelmet
        title={mapSeo?.title}
        description={mapSeo?.description}
        keywords={mapSeo?.keywords}
        canonicalPath="/map"
        jsonLd={mapJsonLd}
      />
      {/* Search Panel */}
      <div className="absolute top-4 left-4 z-10 w-72">
        <div className="bg-card rounded-lg shadow-lg border p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hostels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchArea();
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>{filteredHostels.length} hostels in this area</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search This Area Button */}
      {showSearchButton && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={handleSearchArea}
            size="sm"
            className="bg-card text-card-foreground hover:bg-accent shadow-lg border-2 border-primary/20 rounded-full px-6"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Search this area
          </Button>
        </div>
      )}

      {/* Focused Hostel Info Panel */}
      {selectedHostel && (
        <div className="absolute top-4 right-4 z-10 w-72">
          <div className="bg-card rounded-lg shadow-lg border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{selectedHostel.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {selectedHostel.location || selectedHostel.address}
                </p>
              </div>
              <button
                onClick={handleCloseFocus}
                className="ml-2 p-1 rounded-full hover:bg-muted transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => navigate(`/find/${selectedHostel.id}/room`)}
              size="sm"
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Full Screen Map using existing HostelMap component */}
      <div className="absolute inset-0 z-0">
        <HostelMap
          hostels={filteredHostels}
          viewport={viewport}
          onViewportChange={handleViewportChange}
          height="100%"
          showControls={true}
          onMarkerClick={handleMarkerClick}
          focusedHostelId={focusedHostelId}
        />
      </div>
    </div>
  );
}
