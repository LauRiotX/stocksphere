import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "@/api/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  useEffect(() => {
    console.log('AuthProvider mounted');
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await apiLogin(email, password);
      console.log('AuthContext: Received response from apiLogin');
      if (response.error) {
        throw new Error(response.error);
      }
      if (response?.accessToken) {
        console.log('AuthContext: Access token received, setting tokens');
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
        setIsAuthenticated(true);
        console.log('AuthContext: Login successful, isAuthenticated set to true');
      } else {
        console.log('AuthContext: No access token in response');
        throw new Error('Login failed: No access token received');
      }
    } catch (error) {
      console.log('AuthContext: Login error caught', error);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      console.log('AuthContext: Tokens cleared, isAuthenticated set to false');
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting registration process');
      await apiRegister(email, password);
      console.log('AuthContext: Registration successful');
    } catch (error) {
      console.log('AuthContext: Registration error caught', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Starting logout process');
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    console.log('AuthContext: Tokens cleared, isAuthenticated set to false');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}