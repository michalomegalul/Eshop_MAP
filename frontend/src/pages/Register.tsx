import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        telephone: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://2de7-185-112-167-29.ngrok-free.app/api/register", formData);

            // Check if response status is between 200 and 299
            if (response.status >= 200 && response.status <= 299) {
                // Optionally, log in the user immediately after successful registration
                const loginResponse = await axios.post("https://2de7-185-112-167-29.ngrok-free.app/api/login", {
                    username: formData.username,
                    password: formData.password,
                });

                if (loginResponse.status >= 200 && loginResponse.status <= 299) {
                    localStorage.setItem("access_token", loginResponse.data.access_token);
                    navigate("/eshop"); // Redirect to a protected route
                    alert("Registration successful and logged in!");
                }
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setError("An error occurred while registering. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bgdark transition duration-300 ease-in-out">
            <div className="w-full max-w-md p-8 bg-white dark:bg-accent rounded-lg shadow-lg transition duration-300 ease-in-out">
                <h2 className="text-2xl font-bold text-center mb-6 text-textlight dark:text-bglight">
                    Register
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="mb-6">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your first name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-6">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your last name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Username */}
                    <div className="mb-6">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-6">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="telephone"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
                            placeholder="Enter your phone number"
                            value={formData.telephone}
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
                            value={formData.password}
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
                        Register
                    </button>
                </form>

                {/* Navigation to Sign In */}
                <p className="mt-6 text-sm text-center text-gray-500 dark:text-textdark">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary underline hover:text-red-700 transition"
                    >
                        Login here
                    </Link>
                </p>
            </div>
            <DarkModeToggle />
        </div>
    );
}

export default Register
