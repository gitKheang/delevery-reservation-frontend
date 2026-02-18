import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { mockUser, mockRestaurantOwner, mockAdmin } from "@/data/mockData";
import type { UserProfile } from "@/data/mockData";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (role: "customer" | "restaurant" | "admin") => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsersByRole = {
  customer: mockUser,
  restaurant: mockRestaurantOwner,
  admin: mockAdmin,
} as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (_email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const loginAs = async (
    role: "customer" | "restaurant" | "admin",
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    setUser(mockUsersByRole[role]);
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    _password: string,
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ ...mockUser, name, email, phone });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginAs,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
