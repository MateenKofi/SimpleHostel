import React, { memo, useEffect } from "react";
import { MapMarker, useMap } from "@/components/ui/map";
import { MarkerPosition } from "./map-utils";

interface HostelMarkerProps {
  markerPos: MarkerPosition | null;
  viewportCenter: [number, number];
  onDragEnd?: (pos: MarkerPosition) => void;
  draggable?: boolean;
  onClick?: () => void;
  /** Hostel name shown on the label */
  name?: string;
  /** Hostel logo URL */
  logoUrl?: string | null;
}

export const HostelMarker = memo(({
  markerPos,
  viewportCenter,
  onDragEnd,
  draggable = true,
  onClick,
  name,
  logoUrl,
}: HostelMarkerProps) => {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (map && isLoaded) {
      requestAnimationFrame(() => map.resize());
    }
  }, [map, isLoaded]);

  if (!isLoaded) return null;

  const lng = markerPos ? markerPos.lng : viewportCenter[0];
  const lat = markerPos ? markerPos.lat : viewportCenter[1];

  // Don't render if coordinates are invalid
  if (lng == null || lat == null || isNaN(lng) || isNaN(lat)) return null;

  // Show rich marker only when name/logo provided (listing map)
  if (name) {
    return (
      <MapMarker
        longitude={lng}
        latitude={lat}
        draggable={draggable}
        onDragEnd={(lngLat) => onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat })}
        anchor="bottom"
      >
        <div
          className="flex flex-col items-center cursor-pointer group"
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          {/* Bubble */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-lg px-2 py-1 pr-3 group-hover:shadow-xl group-hover:scale-105 transition-all duration-150">
            {/* Logo / Avatar */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-zinc-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-[10px]">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Name */}
            <span className="text-xs font-semibold text-foreground whitespace-nowrap max-w-[120px] truncate leading-tight">
              {name}
            </span>
          </div>
          {/* Pointer tip */}
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-zinc-900 -mt-px" />
        </div>
      </MapMarker>
    );
  }

  // Fallback: simple pin (used in LocationPicker / SingleHostelMap)
  return (
    <MapMarker
      longitude={lng}
      latitude={lat}
      draggable={draggable}
      onDragEnd={(lngLat) => onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat })}
    >
      <div
        className={`text-primary transition-colors transform -translate-y-1/2 drop-shadow-md ${
          draggable
            ? "cursor-grab active:cursor-grabbing"
            : onClick
            ? "cursor-pointer hover:text-primary/80"
            : "cursor-default"
        }`}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </MapMarker>
  );
});

HostelMarker.displayName = "HostelMarker";
