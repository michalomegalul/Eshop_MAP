import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Replace with your actual publishable key
const stripePromise = loadStripe("pk_test_51Qo5STPsseHpnxsDvD1Bz2MgnmEb9QAEHsNiRBo0gq9EH64cjspzUKDalNaXOKU9tMNLGVG7Ae4ZJEhBzjlwUJBL00fhsd4Cag");

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

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const amount = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0) * 100;

    console.log("Creating Payment Intent for amount:", amount);
    // Get the CSRF token from the cookie (set during login)
    const csrfToken = getCookie("csrf_access_token");

    axios
      .post(
        "https://localhost:5000/api/create-payment-intent",
        {
          amount,
          products: cart.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": csrfToken || "",
          },
        }
      )
      .then((response) => {
        // Set the client secret from the API response
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.error("Payment Intent Error:", error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      console.error("Stripe confirmation error:", result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      // Payment succeeded; optionally remove the cart and create the order
      localStorage.removeItem("cart");

      // Optionally, call the /orders endpoint to store the order details
      // (Here we assume you also have a total_price and list of products to pass)
      const orderData = {
        total_price: result.paymentIntent.amount / 100, // Convert back to dollars
        products: [], // You might want to include product details if needed
      };

      const csrfToken = getCookie("csrf_access_token");

      try {
        await axios.post("http://localhost:5000/api/orders", orderData, {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": csrfToken || "",
          },
        });
        console.log("Order stored successfully.");
      } catch (orderError) {
        console.error("Error storing order:", orderError);
      }

      // Navigate to success page
      navigate("/success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <CardElement />
      <button type="submit" disabled={!stripe} className="mt-4 bg-green-600 text-white py-2 px-4 rounded">
        Pay Now
      </button>
    </form>
  );
};

const CheckoutPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
