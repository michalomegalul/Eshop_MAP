import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

interface CartItem {
  quantity: number;
  price: number;
}

function HeaderEshop() {
  const { isAuthenticated, user, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [cartTotalPrice, setCartTotalPrice] = useState<number>(0);

  useEffect(() => {
    const updateCart = () => {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      setCartItemCount(itemCount);
      setCartTotalPrice(totalPrice);
    };

    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  return (
    <header className="bg-bglight shadow-sm">
      <div className="flex flex-wrap justify-between items-center py-3 px-4 md:px-6 border-b gap-2 text-sm md:text-base">
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
          <a href="https://www.facebook.com/dieselpower.cz/" target="_blank" rel="noopener noreferrer">
            <img src="files/facebook.png" className="h-4 md:h-5" alt="Facebook" />
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center font-semibold text-center md:text-left">
          <a className="hover:underline" href="tel:+420-724-379-112">+420 724 379 112</a>
          <a className="hover:underline" href="mailto:form@dieselpower.cz">form@dieselpower.cz</a>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto justify-center md:justify-end">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{user?.name}</span>
              <button onClick={logout} className="text-red-600 hover:underline">Odhlásit se</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-red-600 hover:underline border-r border-red-600 pr-2">Přihlášení</Link>
              <Link to="/register" className="text-red-600 hover:underline pl-2">Registrace</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 px-4 md:px-6">
        <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <img src="files/DP-logo.png" alt="Logo" className="h-8" />
          </Link>
          <SearchBar />
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <Link to="/cart" className="relative flex items-center gap-2">
            <img src="files/shopping-cart.png" className="h-6" alt="Cart" />
            <span>{cartTotalPrice.toFixed(2)} Kč</span>
            {cartItemCount > 0 && (
              <span className="absolute top-0 left-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HeaderEshop;
