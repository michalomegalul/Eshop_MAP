import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function HeaderEshop() {
  const { isAuthenticated, user, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  // Fetch cart items from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(cart.length);
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

              {/* Orders Link */}
              <Link to="/orders" className="text-blue-600 hover:underline">
                My Orders
              </Link>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative">
                <img src="files/shopping-cart.png" className="h-8" alt="E-Shop" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {cartItemCount}
                  </span>
                )}
              </Link>
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
    </header>
  );
}

export default HeaderEshop;