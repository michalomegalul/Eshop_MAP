import { Link } from "react-router-dom";
import { useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:5000/api/login", formData);
            if (response.status >= 200 && response.status <= 299) {
                localStorage.setItem("access_token", response.data.access_token);
                navigate("/eshop"); // Redirect to a protected route (e.g., dashboard)
                alert("Login successful!");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bgdark transition duration-300 ease-in-out">
            <div className="w-full max-w-md p-8 bg-white dark:bg-accent rounded-lg shadow-lg transition duration-300 ease-in-out">
                <h2 className="text-2xl font-bold text-center mb-6 text-textlight dark:text-bglight">
                    Login
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Username or Email */}
                    <div className="mb-6">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your username or email"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Navigation to Register */}
                <p className="mt-6 text-sm text-center text-gray-500 dark:text-textdark">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary underline hover:text-red-700 transition"
                    >
                        Register here
                    </Link>
                </p>
            </div>
            <DarkModeToggle />
        </div>
    );
}

export default Login;
