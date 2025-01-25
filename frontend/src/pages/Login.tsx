import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import InputField from "../components/InputField";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // Use AuthContext

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");  
        console.log("Form submitted");
    
        try {
            const response = await axios.post(
                "http://localhost:5000/api/login",
                formData,
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                login(response.data.access_token);
                navigate("/eshop");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid credentials. Please try again.");
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
                        label="Username or Email"
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
