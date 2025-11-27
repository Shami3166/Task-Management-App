import React, { createContext, useContext, useReducer, useEffect } from "react";
import apiService from "../services/api";
import { toast } from "sonner";
import type { ApiError, LoginData, RegisterData, User } from "@/types/task";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAIL" }
  | { type: "LOGOUT" };

interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAIL":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("taskManagerToken");
      if (!token) {
        dispatch({ type: "AUTH_FAIL" });
        return;
      }

      const user = await apiService.getCurrentUser();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      console.error("Auth check failed:", error);
      apiService.clearAuthData();
      dispatch({ type: "AUTH_FAIL" });
    }
  };

  const login = async (credentials: LoginData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await apiService.login(credentials);
      apiService.storeAuthData(response.token, {
        _id: response._id,
        name: response.name,
        email: response.email,
      });
      dispatch({ type: "AUTH_SUCCESS", payload: response });
      toast.success("Welcome back! Login successful.");
    } catch (error) {
      const err = error as ApiError;
      dispatch({ type: "AUTH_FAIL" });
      toast.error(err.message || "Login failed. Please try again.");
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await apiService.register(userData);
      apiService.storeAuthData(response.token, {
        _id: response._id,
        name: response.name,
        email: response.email,
      });
      dispatch({ type: "AUTH_SUCCESS", payload: response });
      toast.success("Account created successfully! Welcome!");
    } catch (error) {
      const err = error as ApiError;
      dispatch({ type: "AUTH_FAIL" });
      toast.error(err.message || "Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    apiService.clearAuthData();
    dispatch({ type: "LOGOUT" });
    toast.info("You have been logged out.");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
