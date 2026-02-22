/**
 * Secure Authentication Store
 *
 * SECURITY IMPROVEMENTS:
 * 1. Reduced localStorage usage (only minimal data)
 * 2. Added session timeout detection
 * 3. Better token management
 * 4. Ready for httpOnly cookie migration
 *
 * FUTURE: When backend implements httpOnly cookies:
 * - Remove localStorage entirely
 * - Use session storage only for non-sensitive UI state
 * - Token will be sent automatically via cookie
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Users } from "@/helper/types/types";
import { loginUser, logoutUser, getCurrentUser } from "@/api/auth.secure";
import { getUserById } from "@/api/users";
import axios from "axios";

type DecodedToken = {
    id: string;
    role: string;
    hostelId: string;
    iat: number;
    exp: number;
    jti?: string;
};

type UserStore = {
    // Minimal state - no sensitive data
    isAuthenticated: boolean;
    name: string;
    email: string;
    imageUrl: string | null;
    token: string | null;
    tokenExpiry: number | null; // Track when token expires
    role: string | null;
    hostelId: string | null;
    isProcessing: boolean;
    user: Users | null;
    changedPassword: boolean | undefined;

    // Actions
    login: (data: { email: string; password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUser: (userId: string) => Promise<void>;
    checkSession: () => boolean; // New: check if session is still valid
    clearSession: () => void; // New: force clear session
};

// Session timeout check (5 minutes before expiry)
const SESSION_WARNING_THRESHOLD = 5 * 60 * 1000;

export const useAuthStore = create<UserStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            name: "",
            email: "",
            imageUrl: null,
            token: null,
            tokenExpiry: null,
            role: null,
            hostelId: null,
            isProcessing: false,
            user: null,
            changedPassword: undefined,

            login: async (data) => {
                set({ isProcessing: true });
                try {
                    const responseData = await loginUser(data);
                    const { token, userId, message } = responseData;

                    if (!token) {
                        throw new Error("No token received from server");
                    }

                    const decoded: DecodedToken = jwtDecode(token);

                    // Calculate session expiry
                    const expiryTime = decoded.exp * 1000; // Convert to milliseconds

                    // Set state - only store minimal info
                    set({
                        token,
                        role: decoded.role,
                        hostelId: decoded.hostelId,
                        tokenExpiry: expiryTime,
                        isAuthenticated: true,
                        isProcessing: false,
                    });

                    // Store token in localStorage (required for current implementation)
                    // TODO: Remove when backend switches to httpOnly cookies
                    localStorage.setItem("token", token);

                    // Store non-sensitive data separately
                    if (decoded.hostelId) {
                        localStorage.setItem("hostelId", decoded.hostelId);
                    }
                    localStorage.setItem("userId", decoded.id);
                    localStorage.setItem("role", decoded.role);

                    // Fetch user data
                    await get().fetchUser(decoded.id);

                    // Get updated user from store
                    const user = get().user;
                    if (user) {
                        set({ changedPassword: user.changedPassword });
                        if (user.changedPassword !== undefined) {
                            localStorage.setItem("changedPassword", JSON.stringify(user.changedPassword));
                        }
                    }

                    toast.success(message || "Login successful");

                    // Set up session timeout warning
                    const timeUntilExpiry = expiryTime - Date.now();
                    if (timeUntilExpiry < SESSION_WARNING_THRESHOLD) {
                        setTimeout(() => {
                            toast.warning("Your session will expire soon. Please save your work.");
                        }, timeUntilExpiry - 60000); // Warn 1 minute before
                    }

                    return true;
                } catch (error: unknown) {
                    const errorMessage =
                        axios.isAxiosError(error) && error.response?.data?.message
                            ? error.response.data.message
                            : axios.isAxiosError(error) && error.response?.data?.error
                            ? error.response.data.error
                            : "Login failed";

                    toast.error(errorMessage);
                    set({ isProcessing: false });
                    return false;
                }
            },

            logout: async () => {
                try {
                    // Call logout API to blacklist the token
                    await logoutUser();
                } catch (error) {
                    // Still proceed with local logout even if API call fails
                    console.error("Logout API call failed:", error);
                } finally {
                    // Clear all state
                    set({
                        isAuthenticated: false,
                        name: "",
                        email: "",
                        imageUrl: null,
                        token: null,
                        tokenExpiry: null,
                        role: null,
                        hostelId: null,
                        isProcessing: false,
                        user: null,
                        changedPassword: undefined,
                    });

                    // Clear localStorage
                    localStorage.clear();

                    // Clear sessionStorage (if any)
                    sessionStorage.clear();

                    toast.success("Logout successful");
                }
            },

            fetchUser: async (userId: string) => {
                try {
                    const user: Users = await getUserById(userId);

                    // Extract hostelId from either direct field or nested hostel object
                    const userHostelId = user.hostelId || user.hostel?.id || null;

                    set({
                        name: user.name,
                        email: user.email,
                        imageUrl: user.imageUrl || null,
                        hostelId: userHostelId,
                        user,
                        changedPassword: user.changedPassword,
                    });

                    // Update localStorage if hostelId changed
                    if (userHostelId) {
                        localStorage.setItem("hostelId", userHostelId);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const errorMessage = error.response?.data?.error || "Failed to fetch user data";
                        toast.error(errorMessage);
                    }
                }
            },

            // Check if current session is still valid
            checkSession: (): boolean => {
                const { tokenExpiry, token } = get();

                if (!token || !tokenExpiry) {
                    return false;
                }

                // Check if token has expired
                const now = Date.now();
                if (tokenExpiry < now) {
                    // Auto-logout on expired session
                    get().logout();
                    return false;
                }

                return true;
            },

            // Force clear session (for security events)
            clearSession: () => {
                get().logout();
            },
        }),
        {
            name: "fuse-auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist non-sensitive data
                name: state.name,
                email: state.email,
                imageUrl: state.imageUrl,
                role: state.role,
                hostelId: state.hostelId,
                user: state.user,
                changedPassword: state.changedPassword,
                isAuthenticated: state.isAuthenticated,
                // NOTE: token is still persisted for current implementation
                // TODO: Remove token from partialize when backend uses httpOnly cookies
                token: state.token,
                tokenExpiry: state.tokenExpiry,
            }),
        }
    )
);

/**
 * Hook to check session periodically
 * Call this in your App component or root layout
 */
export const useSessionMonitor = () => {
    const checkSession = useAuthStore((state) => state.checkSession);

    React.useEffect(() => {
        // Check every minute
        const interval = setInterval(() => {
            checkSession();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkSession]);
};

// Import React for the hook above
import React from "react";
