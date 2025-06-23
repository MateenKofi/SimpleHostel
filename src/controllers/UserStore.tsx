import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Users } from "@/helper/types/types";

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
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  fetchUser: (userId: string) => Promise<void>;
};

export const useUserStore = create<UserStore>()(
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

      login: async (data) => {
        set({ isProcessing: true });
        try {
          const response = await axios.post("/api/users/login", data);
          const { token } = response.data;
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

          // Now fetch user data and store it
          await get().fetchUser(decoded.id);

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

      logout: () => {
        set({
          name: "",
          email: "",
          imageUrl: null,
          token: null,
          role: null,
          hostelId: null,
          isProcessing: false,
          user: null,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("hostelId");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("residentId");
        localStorage.removeItem("calendarYear");
        localStorage.removeItem('user')
        localStorage.removeItem('user-storage');
        localStorage.removeItem('added-resident-store');
        toast.success("Logout successful");
        window.location.reload();
      },

      fetchUser: async (userId: string) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`/api/users/get/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user: Users = response.data;

          set({
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl || null,
            user,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
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
        changedPassword: state.user?.changePassword,
      }),
    }
  )
);
