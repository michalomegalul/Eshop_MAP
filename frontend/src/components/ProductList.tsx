import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    reviews: number;
    rating: number;
    stock: number;
    image: string;
}

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('https://2de7-185-112-167-29.ngrok-free.app/api/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    reviews={product.reviews}
                    rating={product.rating}
                    stock={product.stock}
                    image={product.image}
                />
            ))}
        </div>
    );
}

export default ProductList;
