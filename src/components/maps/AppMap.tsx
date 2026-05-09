import React, { memo, useEffect } from "react";
import { Map, MapControls, useMap } from "@/components/ui/map";
import { MarkerPosition } from "./map-utils";

interface AppMapProps {
  viewport: { center: [number, number]; zoom: number; bearing: number; pitch: number };
  onViewportChange?: (viewport: any) => void;
  onMapClick?: (pos: MarkerPosition) => void;
  interactive?: boolean;
  showControls?: boolean;
  height?: string;
  children?: React.ReactNode;
}

const MapClickListener = memo(({ onMapClick }: { onMapClick: (pos: MarkerPosition) => void }) => {
  const { map, isLoaded } = useMap();
  
  useEffect(() => {
    if (!map || !isLoaded) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    };
    
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, onMapClick]);
  
  return null;
});
MapClickListener.displayName = 'MapClickListener';

export function AppMap({ 
  viewport, 
  onViewportChange, 
  onMapClick, 
  interactive = true,
  showControls = true,
  height,
  children 
}: AppMapProps) {
  return (
    <div 
      className={`relative w-full rounded-md overflow-hidden bg-muted ${!height ? 'h-[300px] md:h-[400px]' : ''}`}
      style={height ? { height } : undefined}
    >
      <Map
        viewport={viewport}
        onViewportChange={onViewportChange}
        interactive={interactive}
        className="h-full w-full"
      >
        {children}
        {showControls && <MapControls position="bottom-right" showZoom={true} showLocate={true} />}
        {onMapClick && <MapClickListener onMapClick={onMapClick} />}
      </Map>
    </div>
  );
}
