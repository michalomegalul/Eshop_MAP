import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; role: string; name: string } | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<{ id: string; role: string; name: string } | null>(null);
    const isAuthenticated = !!user;

    const login = async (token: string) => {
        localStorage.setItem("access_token", token);
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await axios.get(`${BASE_URL}/auth-check`, {
                withCredentials: true,
            });
            setUser(response.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            logout();
        }
    };

    useEffect(() => {
        fetchUser(); // Fetch user on initial load
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
