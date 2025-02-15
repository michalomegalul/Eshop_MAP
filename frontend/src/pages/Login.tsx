import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import InputField from "../components/InputField";
const BASE_URL = import.meta.env.VITE_BASE_URL;
function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await axios.post(
                `${BASE_URL}/login`,
                formData,
                { withCredentials: true } // Important: Ensures cookies are used
            );
    
            console.log("Login response:", response.data);
    
            if (response.status === 200) {
                login(); // No need to pass token manually
                navigate("/eshop");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Axios error:", err.response?.data || err.message);
                setError(err.response?.data?.error || "Invalid credentials. Please try again.");
            } else {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred.");
            }
        }
    };
    
    
    
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bgdark transition duration-300 ease-in-out">
            <div className="w-full max-w-md p-8 bg-white dark:bg-accent rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-textlight dark:text-bglight">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-500">
                    Don't have an account? <Link to="/register" className="text-primary underline">Register here</Link>
                </p>
            </div>
            <DarkModeToggle />
        </div>
    );
}

export default Login;
