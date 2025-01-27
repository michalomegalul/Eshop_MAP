import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("your-publishable-key");
type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}
const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const amount = cart.reduce((total : number, item: CartItem) => total + item.price * item.quantity, 0) * 100;

        axios.post("http://localhost:5000/api/create-payment-intent", { 
            amount, 
            products: cart.map((item: CartItem) => ({ id: item.id, name: item.name, quantity: item.quantity })) 
        })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Payment Intent Error:", err));
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
            console.error(result.error.message);
        } else if (result.paymentIntent?.status === "succeeded") {
            localStorage.removeItem("cart");
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
