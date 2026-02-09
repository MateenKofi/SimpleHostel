export const COLORS = [
  "#0a4d3a", // Dark forest green
  "#0d6b6d", // Teal green
  "#4a7c23", // Lime green
  "#3d6b4f", // Sage green
  "#2d5e4a", // Medium forest green
  "#6ea876", // Light sage green
  "#14b8a6", // Teal
  "#213f31", // Deep forest green
  "#94c296", // Pale sage green
] as const;

export const CHART_COLORS = {
  // Primary greens
  forest_dark: "#0a4d3a",    // Dark forest green
  forest_medium: "#2d5e4a",  // Medium forest green
  forest_light: "#4a9c7c",   // Light forest green

  // Teal greens
  teal: "#14b8a6",           // Teal green
  teal_dark: "#0d6b6d",      // Dark teal green

  // Sage greens
  sage: "#6ea876",           // Sage green
  sage_light: "#94c296",     // Light sage green

  // Lime greens
  lime: "#4a7c23",           // Lime green

  // Deep greens
  deep: "#152119",           // Deep green/black
  medium: "#3d6b4f",         // Medium green

  // Neutral warm grays (for contrast)
  warm_gray: "#9c8e7d",      // Warm gray accent

  // Destructive (kept for error charts)
  warm_red: "#ef4444",       // Warm red for danger states
} as const;