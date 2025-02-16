// pages/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar-eshop";
import Headereshop from "../components/header-eshop";
import axios from "axios";
import AddToCart from "../components/AddToCart";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this is set in your .env file

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // expected to be a number
  availability: string;  
  quantity: number;
  imageUrl: string;      
  rating: number;        
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log(`Fetching product from URL: ${BASE_URL}/products/${id}`);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Product data:", response.data);
        setProduct(response.data);
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <main className="flex flex-col font-roboto bg-bglight tablet:px-[4%] pc:px-[10%]">
            <Headereshop />

        <div className="flex flex-1 bg-white border-t-8 border-primary rounded-md">
                <Sidebar />
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={product.imageUrl || "/files/DP-logo-small.png"}
              alt={product.name}
              className="w-full h-80 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>

              <div className="text-xl font-bold text-primary mt-4">
                {product.price !== undefined
                  ? Number(product.price).toLocaleString()
                  : "Price not available"}{" "}
                Kč
              </div>

              <p className="text-accent font-semibold">Skladem {product.availability}</p>

              <AddToCart product={product} className="mt-4" />
            </div>
            </div>
          </div>
    
        </div>
    </main>
  );
}

export default ProductDetail;
