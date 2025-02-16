import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        telephone: "",
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Use AuthContext

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:5000/api/register", formData);

            if (response.status >= 200 && response.status <= 299) {
                const loginResponse = await axios.post("http://localhost:5000/api/login", {
                    username: formData.username,
                    password: formData.password,
                });

                if (loginResponse.status >= 200 && loginResponse.status <= 299) {
                    login(); // Save token in AuthContext
                    navigate("/eshop");
                }
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-bgdark">
            <div className="fixed top-5 right-5">
                <Dropdown />
            </div>
            <div className="w-full max-w-md p-8 bg-white dark:bg-accent rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center dark:text-textdark mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    <InputField label="First Name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} />
                    <InputField label="Last Name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} />
                    <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <InputField label="Username" name="username" type="text" value={formData.username} onChange={handleChange} />
                    <InputField label="Phone Number" name="telephone" type="text" value={formData.telephone} onChange={handleChange} />
                    <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700">
                        Register
                    </button>
                </form>
                <p className="mt-6 text-sm text-center dark:text-textdark">
                    Already have an account? <Link to="/login" className="text-primary underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
