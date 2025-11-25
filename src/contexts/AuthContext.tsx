import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SuperAdmin } from "@/types";

interface AuthContextType {
  user: SuperAdmin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SuperAdmin | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("superAdmin");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("⚠️ Login Mockado ativado");
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser: SuperAdmin = {
      admin_id: "mock-admin-id",
      name: "Admin Teste",
      email: email, 
      password: "", 
    };

    setUser(mockUser);
    localStorage.setItem("superAdmin", JSON.stringify(mockUser));
    localStorage.setItem("token", "token-falso-de-teste-123456"); 
    
    return true; 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("superAdmin");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};