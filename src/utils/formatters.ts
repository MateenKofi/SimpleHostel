/**
 * Formatters utility module
 * Contains functions for formatting various data types for display
 */

/**
 * Formats a number as GHS currency
 * @param amount - The amount to format (defaults to 0 if falsy)
 * @returns Formatted currency string (e.g., "GHS 100.00")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(amount || 0);
};

/**
 * Safely formats a date value using date-fns format function
 * Handles null/undefined/invalid values gracefully
 * @param dateValue - The date value to format
 * @param formatStr - The format string for date-fns
 * @returns Formatted date string or "N/A"
 */
export const safeFormat = (dateValue: any, formatStr: string): string => {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "N/A";
  // Import and use format from date-fns if needed
  // For now, return formatted using toLocaleDateString
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format (can be null or undefined)
 * @returns Formatted date string (e.g., "January 1, 2025") or "N/A"
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Converts backend room type value to user-friendly display format
 * @param backendValue - The backend room type value (single, double, suite, quad)
 * @returns User-friendly display string (e.g., "1 in a room", "2 in a room")
 */
export const backendRoomTypeToDisplay = (backendValue: string | null | undefined): string => {
  if (!backendValue) return "Not specified";

  switch (backendValue) {
    case "single":
      return "1 in a room";
    case "double":
      return "2 in a room";
    case "suite":
      return "3 in a room";
    case "quad":
      return "4 in a room";
    default:
      return backendValue || "Not specified";
  }
};
