import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Helper to extract a cookie by name
const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : undefined;
};

const CheckoutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const csrfToken = getCookie("csrf_access_token");

    try {
      const response = await axios.post(
        `${BASE_URL}/create-checkout-session`,
        { cart },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": csrfToken || "",
          },
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        {loading ? "Redirecting..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default CheckoutPage;
