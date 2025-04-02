import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "/api/";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; role: string; name: string } | null;
    login: () => void;
    logout: () => void;
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
export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string; role: string; name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    const login = async () => {
        await fetchUser();
    };

    const logout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Logout request failed", error);
        } finally {
            setUser(null);
        }
    };

    const fetchUser = async () => {
        try {
            const csrfToken = getCookie("csrf_access_token");

            const response = await axios.get(`${BASE_URL}/auth-check`, {
                withCredentials: true,
                headers: {
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            if (response.status === 200) {
                setUser(response.data);
                setError(null);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setError("Unable to authenticate");
            setUser(null);
        }        
    };
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchUser();
            } catch (err) {
                setError("Failed to authenticate");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
