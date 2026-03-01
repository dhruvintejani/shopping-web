import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Simulated users database
const mockUsers: (User & { password: string })[] = [
  {
    id: 'user_1',
    email: 'demo@shoply.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin_1',
    email: 'admin@shoply.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const user = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      register: async (name, email, password) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const existingUser = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          set({ isLoading: false });
          return false;
        }

        const newUser: User & { password: string } = {
          id: `user_${Date.now()}`,
          email,
          password,
          name,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },
    }),
    {
      name: 'shoply-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
