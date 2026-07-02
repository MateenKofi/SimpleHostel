export const RoomFilterConfig = [
  { category: "gender",   label: "Gender",     options: ["MALE", "FEMALE", "MIX"] },
  { category: "roomType", label: "Type",       options: ["SINGLE","DOUBLE","SUITE","QUAD"] },
  { category: "priceRange", label: "Price",    options: [] },
];

export const PRICE_RANGE_PRESETS = [
  { label: "0 - 1000", min: 0, max: 1000 },
  { label: "1001 - 2000", min: 1001, max: 2000 },
  { label: "2001 - 3500", min: 2001, max: 3500 },
  { label: "3500+", min: 3500, max: Infinity },
];
