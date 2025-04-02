import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "/api/";

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
            await axios.post(`${BASE_URL}logout`, {}, {
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
            const csrfToken = Cookies.get("csrf_access_token");

            const response = await axios.get(`${BASE_URL}auth-check`, {
                withCredentials: true,
                headers: {
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            if (response.status === 200) {
                setUser(response.data);
                setError(null);
            } else {
                await logout();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setError("Unable to authenticate");
            setUser(null); // Don't destroy cookies, just clear state
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
