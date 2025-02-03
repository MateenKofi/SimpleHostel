import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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
};

export const useUserStore = create<User>((set) => ({
  name: '',
  email: '',
  token: null,
  role: null,
  hostelId: null,
  isProcessing: false,
  login: async (data: { email: string; password: string }) => {
    set({ isProcessing: true });
    try {
      const response = await axios.post('/api/users/login', data);
      const { token } = response.data;
      const decoded: DecodedToken = jwtDecode(token);
      set({
        name: decoded.id,
        email: data.email,
        token,
        role: decoded.role,
        hostelId: decoded.hostelId,
        isProcessing: false,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('hostelId', decoded.hostelId);
      localStorage.setItem('userId', decoded.id);
      toast.success('Login successful');
      return true;
    } catch (error) {
      set({ isProcessing: false });
      toast.error('Login failed');
      return false;
    }
  },
  logout: () => {
    set({
      name: '',
      email: '',
      token: null,
      role: null,
      hostelId: null,
    });
    localStorage.removeItem('token');
    toast.success('Logout successful');
  },
}));