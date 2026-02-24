import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "manager" | "admin" | "cashier";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const authContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User & { password: string }> = {
  "manager@onlypassby.com": {
    id: "1",
    email: "manager@onlypassby.com",
    password: "manager123",
    name: "Youssef Amrani",
    role: "manager",
  },
  "admin@onlypassby.com": {
    id: "2",
    email: "admin@onlypassby.com",
    password: "admin123",
    name: "Fatima Zahra",
    role: "admin",
  },
  "cashier@onlypassby.com": {
    id: "3",
    email: "cashier@onlypassby.com",
    password: "cashier123",
    name: "Omar Benali",
    role: "cashier",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("opb_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const found = MOCK_USERS[email.toLowerCase()];
    if (found && found.password === password) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("opb_user", JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("opb_user");
  }, []);

  return (
    <authContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(authContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
