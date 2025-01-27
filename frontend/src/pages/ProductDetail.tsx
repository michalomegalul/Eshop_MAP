import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    availability: string;
    imageUrl: string;
    rating: number;
}

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isLoggedIn = !!localStorage.getItem("token"); // Check login status

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Log the product ID for debugging
                console.log(`Fetching product from URL: ${BASE_URL}products/${id}`);

                const token = localStorage.getItem("token");

                // Add the token to the headers if it's present
                const response = await axios.get(`${BASE_URL}products/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                console.log("Product data:", response.data); // Log response data for debugging
                setProduct(response.data);
            } catch (error: any) {
                console.error("Error fetching product:", error);
                setError("Failed to fetch product. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            navigate("/login"); // Redirect to login if not logged in
        } else {
            console.log(`Added ${product?.name} to the cart`);
            // Add cart logic here
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-contain" />

                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="text-xl font-bold text-primary mt-4">
                        {product.price.toLocaleString()} Kč
                    </div>

                    <p className="text-accent font-semibold">Skladem {product.availability}</p>

                    <button
                        onClick={handleAddToCart}
                        className="mt-4 w-full bg-primary text-white text-sm font-bold py-2 rounded hover:bg-red-800 transition"
                    >
                        Do košíku
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
