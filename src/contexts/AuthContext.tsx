import { createContext, useContext, useState, ReactNode } from "react";
import { SuperAdmin } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/api-config";

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
  const { toast } = useToast();
  const [user, setUser] = useState<SuperAdmin | null>(() => {
    const storedUser = localStorage.getItem("superAdmin");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
        localStorage.removeItem("superAdmin");
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const adminUser: SuperAdmin = {
          admin_id: data.id.toString(),
          name: data.name,
          email: data.email,
          password: "",
        };

        localStorage.setItem("token", data.jwt);
        localStorage.setItem("superAdmin", JSON.stringify(adminUser));
        
        setUser(adminUser);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro na requisição de login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await fetch("/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error("Erro ao realizar logout no backend", error);
    } finally {
        setUser(null);
        localStorage.removeItem("superAdmin");
        localStorage.removeItem("token");
    }
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