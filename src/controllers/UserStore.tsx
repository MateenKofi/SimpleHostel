import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

type User = {
  name: string;
  email: string;
  token: string | null;
  role: { id: number; name: string; status: string; permissions: { id: number; status: string }[] } | null;
  isProcessing: boolean;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
};

export const useUserStore = create<User>((set) => ({
  name: '',
  email: '',
  phone: '',
  token: null,
  role: null,
  isProcessing: false,

  login: async (data) => {
    set({ isProcessing: true });
    try {
      const res = await axiosInstance.post('api/users/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200) {
        console.log(res)
        const { token, userId } = res?.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        toast.success('User Login Successful');
        return true;
      }
    } catch (err) {
      console.error(err);
      toast.error('Invalid username or Password');
    } finally {
      set({ isProcessing: false });
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      name: '',
      email: '',
      phone: '',
      token: null,
      role: null,
      isProcessing: false,
    });
    toast('User logged out');
  },
}));