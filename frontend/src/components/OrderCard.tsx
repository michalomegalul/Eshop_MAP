import React, { useState } from "react";
import axios from "axios";

export interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  likes: number; // Add this field to track likes
}

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [likes, setLikes] = useState(order.likes);
  const [liked, setLiked] = useState(false);

  const likeOrder = async () => {
    if (liked) return; // Prevent double likes
    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/${order.id}/like`,
        {},
        { withCredentials: true }
      );
      setLikes(response.data.likes);
      setLiked(true);
    } catch (error) {
      console.error("Error liking order:", error);
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
      <p className="text-sm text-gray-600">Status: {order.status}</p>
      <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
      <p className="text-sm text-gray-600">Created At: {order.created_at}</p>

      <div className="flex justify-between items-center mt-3">
        <button
          onClick={likeOrder}
          disabled={liked}
          className={`px-3 py-1 rounded text-white ${
            liked ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {liked ? "Liked" : "Like"} ({likes})
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
