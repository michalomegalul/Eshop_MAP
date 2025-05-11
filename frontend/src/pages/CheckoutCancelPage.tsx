import { Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutCancelPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout cancelled</h1>
          <p className="mt-4 text-base text-gray-500">
            Your payment was cancelled and you have not been charged.
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your items are still in your cart if you wish to complete your purchase.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/cart"
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Return to cart
            </Link>
            <Link
              to="/"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
