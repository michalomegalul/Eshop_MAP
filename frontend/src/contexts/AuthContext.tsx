import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';

// Define the shape of our user type
export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    telephone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear user data if auth check fails
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuthStatus();
    
    // Set up periodic token refresh (every 14 minutes)
    // This helps keep the session alive if the user is active
    const refreshInterval = setInterval(async () => {
      // Only attempt refresh if we have a valid user session
      if (user) {
        try {
          // Use the API directly to avoid setting loading state for background refreshes
          const userData = await authService.checkAuth();
          if (!userData) {
            // If checkAuth returns null, the session is invalid
            setUser(null);
          }
        } catch (err) {
          console.error('Background token refresh failed:', err);
          // Don't clear user on network errors to avoid disrupting user experience
          // on temporary connectivity issues
        }
      }
    }, 14 * 60 * 1000); // 14 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user]);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(username, password);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    telephone?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Logout failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the auth context to children components
  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
