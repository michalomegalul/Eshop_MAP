import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api";

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

const Sidebar = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <aside className="bg-white dark:bg-gray-800 w-64 p-4 shadow-lg rounded-lg">
            <nav>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="relative group"
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            
                        >
                            <button
                                onClick={() => handleCategoryClick(category.id)}
                                className={`block w-full text-left p-3 rounded-lg bg-white dark:bg-gray-700 shadow-md text-gray-800 dark:text-white transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                                    hoveredCategory === category.id ? "bg-gray-300 dark:bg-gray-500" : ""
                                }`}
                        >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
