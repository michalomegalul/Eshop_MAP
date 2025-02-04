import { Link } from "react-router-dom";

const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="mb-8">
        Your payment process was cancelled. If you wish to try again, click below.
      </p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">
        Back to Shop
      </Link>
    </div>
  );
};

export default CancelPage;
