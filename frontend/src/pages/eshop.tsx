import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar-eshop";
import Headereshop from "../components/header-eshop";
import ProductCardRaw from "../components/ProductCardRaw";
import Footer from "../components/footer";

const BASE_URL = 'http://localhost:5000/api/';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    availability: string;
    imageUrl: string;
    rating: number;
}

function Eshop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}products`, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        
        

        fetchProducts();
    }, []);

    return (
        <main className="flex flex-col font-roboto bg-bglight tablet:px-[4%] pc:px-[10%]">
            {/* Header */}
            <Headereshop />

            {/* Main Content Area */}
            <div className="flex flex-1 bg-white border-t-8 border-primary rounded-md">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="p-6 flex-1">
                    {/* Banner */}
                    <div className="relative shadow-[0_3px_6px_rgba(0,0,0,.16)] mb-6">
                        <img
                            src="./files/audi.jpg"
                            alt="Banner"
                            className="w-full h-[450px] object-cover rounded-lg"
                        />
                        <div className="absolute top-6 right-6 bg-red-500 text-white text-lg font-bold p-2 rounded">
                            -20% Oprava Teplých Startů
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 pc:grid-cols-4 gap-6">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            products.map((product) => (
                                <ProductCardRaw key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default Eshop;
