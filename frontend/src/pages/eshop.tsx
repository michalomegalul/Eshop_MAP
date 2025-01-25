import { useEffect, useState, useRef, useCallback } from 'react';
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
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}products?page=${page}&per_page=12`, {
                    headers: { Accept: 'application/json' }
                });

                const newProducts = response.data.products.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    availability: product.stock_quantity > 0 ? "In Stock" : "Out of Stock",
                    imageUrl: "/files/DP-logo-small.png",
                    rating: 4.5,
                }));

                setProducts(prevProducts => [...prevProducts, ...newProducts]);
                setHasMore(response.data.products.length > 0); // If no more products, stop loading
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <main className="flex flex-col font-roboto bg-bglight tablet:px-[4%] pc:px-[10%]">
            <Headereshop />

            <div className="flex flex-1 bg-white border-t-8 border-primary rounded-md">
                <Sidebar />

                <div className="p-6 flex-1">
                    <div className="relative shadow-[0_3px_6px_rgba(0,0,0,.16)] mb-6">
                        <img src="./files/audi.jpg" alt="Banner" className="w-full h-[450px] object-cover rounded-lg" />
                        <div className="absolute top-6 right-6 bg-red-500 text-white text-lg font-bold p-2 rounded">
                            -20% Oprava Teplých Startů
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 pc:grid-cols-4 gap-6">
                        {products.map((product, index) => {
                            if (index === products.length - 1) {
                                return <div ref={lastProductRef} key={product.id}><ProductCardRaw product={product} /></div>;
                            }
                            return <ProductCardRaw key={product.id} product={product} />;
                        })}
                    </div>

                    {loading && <div className="text-center mt-4">Loading...</div>}
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default Eshop;
