export const COLORS = [
  "#4a9c7c", // Forest green 500
  "#14b8a6", // Teal green 500
  "#b09d81", // Warm gray 500
  "#ef4444", // Warm red 500
  "#7ca672", // Sage green 500
  "#7bd5a5", // Forest green 400
  "#5eead4", // Teal green 300
  "#9a876c", // Warm gray 600
  "#f56b65", // Warm red 400
] as const;

export const CHART_COLORS = {
  // Forest greens
  forest_dark: "#1e3f31",   // Forest green 800
  forest_medium: "#2c5e4a", // Forest green 700
  forest: "#4a9c7c",        // Forest green 500
  forest_light: "#7bd5a5",  // Forest green 400

  // Teal greens
  teal: "#14b8a6",          // Teal green 500
  teal_dark: "#0d9488",     // Teal green 600

  // Warm grays
  warm_gray: "#b09d81",     // Warm gray 500
  warm_gray_light: "#dbd3c4", // Warm gray 300

  // Deep greens
  deep: "#0f2018",          // Forest green 900
  medium: "#2c5e4a",        // Forest green 700

  // Accents
  sage_green: "#7ca672",    // Sage green 500

  // Destructive (for error charts)
  danger: "#ef4444",        // Warm red 500
} as const;