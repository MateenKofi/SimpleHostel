import type { ResidentDto } from "@/types/dtos"

/**
 * Determines if a resident is verified based on their status and check-in date.
 * A resident is verified if they have an "active" status and a non-null checkInDate.
 *
 * This mirrors the backend verification logic from mateen_hostel/src/helper/residentHelper.ts
 *
 * @param resident - The resident object to check
 * @returns true if the resident is verified, false otherwise
 */
export const isResidentVerified = (resident: ResidentDto | null | undefined): boolean => {
  if (!resident) return false
  return resident.status === "active" && resident.checkInDate !== null
}

/**
 * Gets the verification badge variant for a resident
 *
 * @param resident - The resident object
 * @returns The badge variant and label for the resident's verification status
 */
export const getVerificationBadge = (
  resident: ResidentDto | null | undefined,
): {
  variant: "default" | "secondary" | "destructive" | "outline"
  label: string
} => {
  const verified = isResidentVerified(resident)

  return {
    variant: verified ? ("default" as const) : ("secondary" as const),
    label: verified ? "Verified" : "Unverified",
  }
}
