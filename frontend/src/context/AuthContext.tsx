import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "/api/";

// Create configured axios instance with credentials support
const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true  // Important for cookies to be sent
});

// Add an interceptor to include the token in requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; role: string; name: string } | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string; role: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null); // Reset any previous errors
            
            const response = await authApi.post('/login', { username, password });
            
            // Store tokens
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            
            // Set user
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            setError("Authentication failed. Please check your credentials.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            // Call logout endpoint if needed
            await authApi.post('/logout');
        } catch (error) {
            console.error("Logout request failed", error);
            setError("Logout failed. Please try again.");
        } finally {
            // Clear tokens and user state
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setLoading(false);
        }
    };

    // Check if user is authenticated on component mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            try {
                setError(null);
                const response = await authApi.get('/auth-check');
                setUser(response.data);
            } catch (error) {
                console.error("Auth check failed:", error);
                setError("Session expired. Please login again.");
                // Clear invalid tokens
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                loading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};