import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Users } from "@/helper/types/types";
import { loginUser, logoutUser } from "@/api/auth";
import { getUserById } from "@/api/users";
import axios from "axios";

type DecodedToken = {
    id: string;
    role: string;
    hostelId: string;
    iat: number;
    exp: number;
};

type UserStore = {
    name: string;
    email: string;
    imageUrl: string | null;
    token: string | null;
    role: string | null;
    hostelId: string | null;
    isProcessing: boolean;
    user: Users | null;
    changedPassword: boolean | undefined;
    login: (data: { email: string; password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    fetchUser: (userId: string) => Promise<void>;
};


export const useAuthStore = create<UserStore>()(
    persist(
        (set, get) => ({
            name: "",
            email: "",
            imageUrl: null,
            token: null,
            role: null,
            hostelId: null,
            isProcessing: false,
            user: null,
            changedPassword: undefined,

            login: async (data) => {
                set({ isProcessing: true });
                try {
                    const responseData = await loginUser(data);
                    const { token } = responseData;
                    const decoded: DecodedToken = jwtDecode(token);

                    // Set token + other basics first
                    set({
                        token,
                        role: decoded.role,
                        hostelId: decoded.hostelId,
                        isProcessing: false,
                    });

                    // Save token to localStorage
                    localStorage.setItem("token", token);
                    localStorage.setItem("hostelId", decoded.hostelId);
                    localStorage.setItem("userId", decoded.id);
                    localStorage.setItem("role", decoded.role);

                    // Fetch user data and store it
                    await get().fetchUser(decoded.id);

                    // Get the latest user from the store
                    const user = get().user;
                    if (user) {
                        localStorage.setItem("changedPassword", JSON.stringify(user.changedPassword));
                        set({ changedPassword: user.changedPassword });
                    }

                    toast.success("Login successful");
                    return true;
                } catch (error: unknown) {
                    const errorMessage =
                        axios.isAxiosError(error) && error.response?.data?.error
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
                    // Clear state regardless of API result
                    set({
                        name: "",
                        email: "",
                        imageUrl: null,
                        token: null,
                        role: null,
                        hostelId: null,
                        isProcessing: false,
                        user: null,
                        changedPassword: undefined,
                    });
                    localStorage.clear();
                    toast.success("Logout successful");
                }
            },

            fetchUser: async (userId: string) => {
                try {
                    // Note: Authorization header is handled by axiosInstance interceptor
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
        }),
        {
            name: "user-storage",
            partialize: (state) => ({
                name: state.name,
                email: state.email,
                imageUrl: state.imageUrl,
                token: state.token,
                role: state.role,
                hostelId: state.hostelId,
                user: state.user,
                changedPassword: state.changedPassword,
            }),
        }
    )
);
