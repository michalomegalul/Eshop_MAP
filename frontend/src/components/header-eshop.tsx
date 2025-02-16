import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

// Define the type for the cart item
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
      <div className="flex flex-row justify-between items-center py-3 mx-6 border-b">
        {/* Social Media Icons */}
        <div className="flex flex-row gap-2 w-[165px]">
          <a href="https://www.facebook.com/dieselpower.cz/" target="_blank" rel="noopener noreferrer">
            <img src="files/facebook.png" className="h-4" alt="Facebook" />
          </a>
        </div>

        {/* Contact Information */}
        <div className="flex flex-row gap-4 items-center font-semibold">
          <a className="hover:underline transition-all" href="tel:+420-724-379-112">
            +420 724 379 112
          </a>
          <a href="mailto:form@dieselpower.cz" className="hover:underline transition-all">
            form@dieselpower.cz
          </a>
        </div>

        {/* User Actions */}
        <div className="flex flex-row w-[165px] justify-end items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* User Info and Logout */}
              <div className="flex flex-row items-center gap-2">
                <span className="text-gray-700">{user?.name}</span>
                <button onClick={logout} className="text-red-600 hover:underline">
                  Odhlásit se
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login and Register Links */}
              <Link to="/login" className="text-red-600 hover:underline border-r border-red-600 pr-2">
                Přihlášení
              </Link>
              <Link to="/register" className="text-red-600 hover:underline pl-2">
                Registrace
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center py-6 px-6">
        <div className="flex items-center space-x-4 gap-8">
          <a href="" className='h-full flex items-center cursor-pointer hover:scale-[1.015] transition-transform duration-300'>
            <img
              src="files/DP-logo.png"
              alt="Logo"
              className='h-8'
            />
          </a>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-8 text-sm">
          <div className="relative">
            <Link to="/cart" className="flex items-center space-x-2 relative">
              <img className="h-6" src="files/shopping-cart.png" alt="Cart" />
              <span>{cartTotalPrice.toFixed(2)} Kč</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 left-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderEshop;