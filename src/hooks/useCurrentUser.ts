import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/useAuthStore"
import { getUserById } from "@/api/users"

/**
 * Hook to fetch and cache the current user data using TanStack Query.
 * This ensures that user data is always fresh and consistent across components.
 *
 * @returns Object containing:
 * - user: The current user data (including hostel object)
 * - isLoading: Whether the user data is being fetched
 * - isError: Whether there was an error fetching user data
 * - error: The error object if isError is true
 * - refetch: Function to manually refetch user data
 */
export const useCurrentUser = () => {
    const userId = useAuthStore((state) => state.user?.id)

    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            if (!userId) throw new Error("No user ID available")
            return await getUserById(userId)
        },
        enabled: !!userId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return {
        user: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}
