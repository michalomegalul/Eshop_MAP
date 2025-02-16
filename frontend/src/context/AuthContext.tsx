import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { id: string; role: string; name: string } | null;
    login: () => void;
    logout: () => void;
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
    const isAuthenticated = !!user;

    const login = async () => {
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    const fetchUser = async () => {
        try {
            const response = await axios(`${BASE_URL}auth-check`, {
                withCredentials: true,
                method: "GET",

            });

            if (response.status === 200) {
                setUser(response.data);
            } else {
                logout();
            }
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
};
