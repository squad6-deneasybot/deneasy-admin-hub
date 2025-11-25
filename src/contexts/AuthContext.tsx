import { createContext, useContext, useState, ReactNode } from "react";
import { SuperAdmin } from "@/types";

interface AuthContextType {
  user: SuperAdmin | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
  // CORREÇÃO: Inicialização Lazy (preguiçosa) para evitar race condition e crash
  const [user, setUser] = useState<SuperAdmin | null>(() => {
    const storedUser = localStorage.getItem("superAdmin");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
        localStorage.removeItem("superAdmin"); // Limpa dados corrompidos
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockUser: SuperAdmin = {
      admin_id: "1",
      name: "Admin DeneasyBot",
      email: email,
      password: password,
    };

    setUser(mockUser);
    localStorage.setItem("superAdmin", JSON.stringify(mockUser));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration
    const newUser: SuperAdmin = {
      admin_id: Math.random().toString(36).substring(7),
      name,
      email,
      password,
    };

    setUser(newUser);
    localStorage.setItem("superAdmin", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("superAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};