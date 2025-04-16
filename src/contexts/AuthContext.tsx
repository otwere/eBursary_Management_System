
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<{ role: UserRole } | null>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    institutionType?: string,
    institutionName?: string
  ) => Promise<{ role: UserRole } | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
          });
        } catch (error) {
          console.error("Failed to parse stored user", error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          localStorage.removeItem("user");
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    // Simulate loading delay
    setTimeout(checkAuth, 500);
  }, []);

  const login = async (email: string, password: string): Promise<{ role: UserRole } | null> => {
    // For demo purposes, we'll simulate a successful login
    // In a real app, this would verify credentials with an API
    
    // Map emails to roles for demo
    let role: UserRole = "student";
    
    if (email.includes("aro")) {
      role = "ARO";
    } else if (email.includes("fao")) {
      role = "FAO";
    } else if (email.includes("fdo")) {
      role = "FDO";
    } else if (email.includes("admin")) {
      role = "superadmin";
    }
    
    const user: User = {
      id: "user-123",
      name: email.split("@")[0],
      email,
      role,
      studentId: role === "student" ? "S12345" : undefined,
      institutionType: role === "student" ? "University" : undefined,
      institutionName: role === "student" ? "University of Technology" : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // Update auth state
    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
    });

    return { role };
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    institutionType?: string,
    institutionName?: string
  ): Promise<{ role: UserRole } | null> => {
    // Create new user
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      studentId: role === "student" ? `S${Date.now().toString().slice(-5)}` : undefined,
      institutionType: institutionType as any,
      institutionName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // Update auth state
    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
    });

    return { role };
  };

  const logout = () => {
    // Clear user from localStorage
    localStorage.removeItem("user");
    
    // Update auth state
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
