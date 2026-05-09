export type MarkerPosition = {
  lng: number;
  lat: number;
};

export type SearchResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

export type ReverseGeocodeResult = {
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
  display_name?: string;
};

export const performReverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResult | undefined> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: { Accept: "application/json" }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Reverse geocoding failed", e);
  }
  return undefined;
};
