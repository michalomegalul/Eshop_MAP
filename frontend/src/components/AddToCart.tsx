// components/AddToCart.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../pages/eshop";

interface AddToCartProps {
    product: Product;
    className?: string;
}

const AddToCart: React.FC<AddToCartProps> = ({ product, className }) => {
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
    
        window.dispatchEvent(new Event("storage"));
    
        console.log(`Added ${product.name} to the cart`);
    };
    

    return (
        <button
            onClick={handleAddToCart}
            className={`w-full bg-primary text-white text-sm font-bold py-2 rounded hover:bg-red-800 transition ${className}`}
        >
            Do košíku
        </button>
    );
};

export default AddToCart;