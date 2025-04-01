import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import InputField from "../components/InputField";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/eshop"); // Redirect if already logged in
        }
    }, [isAuthenticated, loading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");
        setSubmitting(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/login`,
                formData,
                { withCredentials: true }
            );

            if (response.status === 200) {
                await login(); // fetch user data
                navigate("/eshop");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Login error:", err.response?.data || err.message);
                setFormError(err.response?.data?.error || "Invalid credentials.");
            } else {
                setFormError("Unexpected error occurred.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-500">Checking your session...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100 dark:bg-bgdark transition duration-300 ease-in-out">
            <div className="fixed top-5 right-5">
                <Dropdown />
            </div>
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
                    {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {submitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-500">
                    Don&apos;t have an account? <Link to="/register" className="text-primary underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
