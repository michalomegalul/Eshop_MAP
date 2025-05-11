import { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  // Get the session ID from the URL query parameters
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If there's a session ID, it means the payment was successful
    if (sessionId) {
      // Clear the cart
      clearCart();
      
      // You could also verify the session with your backend here
      // to confirm the payment went through
    } else {
      // If there's no session ID, redirect to the home page
      navigate('/');
    }
  }, [sessionId, clearCart, navigate]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Order successful!</h1>
          <p className="mt-4 text-base text-gray-500">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        {/* You can add order details here if you fetch them from your backend */}
      </div>
    </div>
  );
}
