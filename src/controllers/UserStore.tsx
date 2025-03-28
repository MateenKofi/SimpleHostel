import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";


type DecodedToken = {
  id: string;
  role: string;
  hostelId: string;
  iat: number;
  exp: number;
};

type User = {
  name: string;
  email: string;
  token: string | null;
  role: string | null;
  hostelId: string | null;
  isProcessing: boolean;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  setUser: (token: string) => void;
};

// Create Zustand Store
export const useUserStore = create<User>((set) => ({
  name: "",
  email: "",
  token: null,
  role: null,
  hostelId: null,
  isProcessing: false,

  // Login function
  login: async (data) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post("/api/users/login", data);
      const { token } = response.data;
      const decoded: DecodedToken = jwtDecode(token);

      set({
        name: "", // Name should be fetched separately
        email: data.email,
        token,
        role: decoded.role,
        hostelId: decoded.hostelId,
        isProcessing: false,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("hostelId", decoded.hostelId);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem('role',decoded.role);

      toast.success("Login successful");
      return true;
    } catch (error: AxiosError<{message:string}>) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      set({ isProcessing: false });
      return false;
    }
  },

  // Logout function
  logout: () => {
    set({
      name: "",
      email: "",
      token: null,
      role: null,
      hostelId: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("hostelId");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("residentId")
    toast.success("Logout successful");
  },

  // Function to set user from token (useful for refreshing state)
  setUser: (token) => {
    const decoded: DecodedToken = jwtDecode(token);
    set({
      name: "", // Should be fetched separately
      email: "", // Needs to be retrieved
      token,
      role: decoded.role,
      hostelId: decoded.hostelId,
    });
  },
}));


