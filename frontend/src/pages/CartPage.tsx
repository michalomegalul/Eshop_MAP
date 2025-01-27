import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface CartItem {
    id: string;
    name: string;
    description: string;
    price: number;
    availability: string;
    imageUrl: string;
    rating: number;
    quantity: number;
}

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return; // Prevent quantity from going below 1

        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeItem = (id: string) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Váš košík</h1>
            {cart.length === 0 ? (
                <p className="text-gray-600">Košík je prázdný.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center border p-4 rounded-lg shadow-md bg-white">
                            <img src={item.imageUrl || "/files/DP-logo-small.png"} alt={item.name} className="w-20 h-20 object-contain mr-4" />
                            <div className="flex-grow">
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <p className="text-gray-600">{item.price.toLocaleString()} Kč</p>
                                <div className="flex items-center mt-2">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 bg-gray-300 rounded"
                                    >-</button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 bg-gray-300 rounded"
                                    >+</button>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="ml-4 text-red-600 font-bold"
                            >Odstranit</button>
                        </div>
                    ))}
                    <div className="mt-4 text-xl font-bold">
                        Celkem: {getTotalPrice()} Kč
                    </div>
                    <button
                    onClick={() => navigate("/checkout")}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    Pokračovat k platbě
                </button>

                </div>
            )}
        </div>
    );
};

export default CartPage;
