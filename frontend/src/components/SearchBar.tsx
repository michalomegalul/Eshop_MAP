import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = () => {
    const [query, setQuery] = useState(""); // Search query
    const [products, setProducts] = useState<any[]>([]); // Fetched products
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Products matching the query
    const [loading, setLoading] = useState(false); // Loading state

    // Fetch all products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "https://2de7-185-112-167-29.ngrok-free.app/api/products"
                );
                setProducts(response.data); // Store all products
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        if (query.trim() === "") {
            setFilteredProducts([]); // Clear results if query is empty
            return;
        }

        const results = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
    }, [query, products]);

    return (
        <div className="relative">
            {/* Search Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zadejte hledaný výraz..."
                className="border-gray-100 rounded-lg px-4 py-2 w-96 bg-white shadow-md hover:bg-slate-50 transition-all"
            />

            {/* Results Dropdown */}
            <ul
                className={`absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-2 p-4 space-y-2 overflow-y-auto transition-all ${
                    query && filteredProducts.length > 0
                        ? "block fixed max-h-64 z-50" // Show fixed dropdown when there’s a search
                        : "hidden" // Hide when query is empty
                }`}
                style={{ width: "24rem" }} // Matches input width
            >
                {loading ? (
                    <li className="text-gray-500">Načítání produktů...</li>
                ) : filteredProducts.length === 0 ? (
                    <li className="text-gray-500">Žádné výsledky...</li>
                ) : (
                    filteredProducts.map((product) => (
                        <li
                            key={product.id}
                            className="py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            {product.name}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SearchBar;
