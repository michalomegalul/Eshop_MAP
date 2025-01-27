import { useNavigate } from "react-router-dom";
import type { Product } from "../pages/eshop";
import { useAuth } from "../context/AuthContext";

interface ProductCardRawProps {
    product: Product;
}

const ProductCardRaw: React.FC<ProductCardRawProps> = ({ product }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to product detail

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]") as Product[];
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(`Added ${product.name} to the cart`);
    };

    return (
        <div 
            className="border rounded-lg shadow-md p-4 flex flex-col bg-white cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <div className="relative">
                <img
                    src={product.imageUrl || "/files/DP-logo-small.png"}
                    alt={product.name}
                    className="w-full h-40 object-contain bg-transparent"
                />
            </div>

            <div className="mt-4 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>

                <div className="flex items-center text-yellow-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={i < product.rating ? "currentColor" : "none"}
                            stroke={i < product.rating ? "none" : "currentColor"}
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M12 .587l3.668 7.57 8.332 1.151-6.084 5.775 1.716 8.24L12 18.896l-7.632 4.427 1.716-8.24-6.084-5.775 8.332-1.151z" />
                        </svg>
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">({product.rating}, 56x)</span>
                </div>

                <div className="text-xl font-bold text-primary mb-1">
                    {product.price.toLocaleString()} Kč
                </div>

                <p className="text-accent font-semibold mb-4">Skladem {product.availability}</p>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white text-sm font-bold py-2 rounded hover:bg-red-800 transition"
                >
                    Do košíku
                </button>
            </div>
        </div>
    );
};

export default ProductCardRaw;
