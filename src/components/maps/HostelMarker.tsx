import React, { memo, useEffect } from "react";
import { MapMarker, MarkerContent, useMap } from "@/components/ui/map";
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
        <MarkerContent>
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
        </MarkerContent>
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
      <MarkerContent>
        <div
          className={`text-primary transition-colors transform drop-shadow-md ${
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
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" className="drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" fill="currentColor" stroke="#ffffff" strokeWidth="2.5"/>
            <path d="M10 21v-4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v4M10 24v-3M26 24v-3M10 15V13c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2M10 21h16" stroke="#ffffff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </MarkerContent>
    </MapMarker>
  );
});

HostelMarker.displayName = "HostelMarker";
