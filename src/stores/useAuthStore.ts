import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import type { UserDto } from "@/types/dtos";
import { loginUser, logoutUser, getCurrentUser } from "@/api/auth";
import { getUserById } from "@/api/users";
import axios from "axios";

type DecodedToken = {
    id: string;
    role: string;
    hostelId: string;
    iat: number;
    exp: number;
    jti?: string;
    permissions?: string[];
};

type UserStore = {
    // Enhanced with session tracking
    isAuthenticated: boolean;
    name: string;
    email: string;
    imageUrl: string | null;
    token: string | null;
    tokenExpiry: number | null; // Track when token expires
    role: string | null;
    hostelId: string | null;
    permissions: string[] | undefined;
    isProcessing: boolean;
    user: UserDto | null;
    changedPassword: boolean | undefined;

    // Actions
    login: (data: { email: string; password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUser: (userId: string) => Promise<void>;
    checkSession: () => boolean; // Check if session is still valid
    clearSession: () => void; // Force clear session
};


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
            permissions: undefined,
            isProcessing: false,
            user: null,
            changedPassword: undefined,

            login: async (data) => {
                set({ isProcessing: true });
                try {
                    const responseData = await loginUser(data);
                    const { token, userId } = responseData;

                    if (!token) {
                        throw new Error("No token received from server");
                    }

                    const decoded: DecodedToken = jwtDecode(token);

                    // Calculate session expiry (in milliseconds)
                    const expiryTime = decoded.exp * 1000;

                    // Set state - only store minimal info
                    set({
                        token,
                        role: decoded.role,
                        hostelId: decoded.hostelId,
                        permissions: decoded.permissions,
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

                    // Fetch user data and store it
                    await get().fetchUser(decoded.id);

                    // Get the latest user from the store
                    const user = get().user;
                    if (user) {
                        set({ changedPassword: user.changedPassword });
                        if (user.changedPassword !== undefined) {
                            localStorage.setItem("changedPassword", JSON.stringify(user.changedPassword));
                        }
                    }

                    toast.success("Login successful");

                    // Set up session timeout warning (5 minutes before expiry)
                    const timeUntilExpiry = expiryTime - Date.now();
                    const WARNING_THRESHOLD = 5 * 60 * 1000;
                    if (timeUntilExpiry < WARNING_THRESHOLD && timeUntilExpiry > 0) {
                        setTimeout(() => {
                            toast.warning("Your session will expire soon. Please save your work.");
                        }, timeUntilExpiry - WARNING_THRESHOLD);
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
                        permissions: undefined,
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
                    // Note: Authorization header is handled by axiosInstance interceptor
                    const user: UserDto = await getUserById(userId);

                    // Extract hostelId from either direct field or nested hostel object
                    const userHostelId = user.hostelId || user.hostel?.id || null;

                    set({
                        name: user.name,
                        email: user.email,
                        imageUrl: user.imageUrl || null,
                        hostelId: userHostelId,
                        user,
                        changedPassword: (user as any).changedPassword,
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
            partialize: (state) => ({
                // Only persist non-sensitive data
                name: state.name,
                email: state.email,
                imageUrl: state.imageUrl,
                role: state.role,
                hostelId: state.hostelId,
                permissions: state.permissions,
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
