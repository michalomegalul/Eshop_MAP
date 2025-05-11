import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { productService } from '../services/api';
import { getProductImageUrl, getFallbackImageUrl } from '../utils/imageUtils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: getProductImageUrl()
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-7xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg md:w-1/2"></div>
            <div className="space-y-6 md:w-1/2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Product Not Found</h1>
          <p className="mt-4 text-base leading-7 text-gray-600">{error || 'The product you are looking for does not exist.'}</p>
          <div className="mt-10">
            <Link to="/products" className="text-sm font-semibold leading-7 text-primary-600">
              <span aria-hidden="true">&larr;</span> Back to products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="mx-auto flex max-w-7xl items-center space-x-2 px-4 sm:px-6 lg:px-8">
            <li>
              <div className="flex items-center">
                <Link to="/products" className="mr-2 text-sm font-medium text-gray-900">
                  Products
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <span className="font-medium text-gray-500" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product */}
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Product image */}
            <div className="lg:col-span-1 lg:self-center">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={getProductImageUrl()}
                  alt={product.name}
                  className="h-full w-full object-contain object-center"
                  onError={(e) => {
                    // If image fails to load, use fallback
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImageUrl();
                  }}
                />
              </div>
            </div>

            {/* Product details */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:col-span-1 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
              
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock_quantity > 0 
                    ? `In stock (${product.stock_quantity} available)` 
                    : 'Out of stock'}
                </p>
              </div>

              <form className="mt-6">
                {/* Quantity selector */}
                <div className="mt-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={product.stock_quantity === 0}
                  >
                    {[...Array(Math.min(10, product.stock_quantity)).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-10 flex flex-col space-y-4">
                  <button
                    type="button"
                    className="w-full bg-primary-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                  >
                    Add to cart
                  </button>
                  <Link
                    to="/products"
                    className="text-center text-sm text-primary-600 hover:text-primary-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </form>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">Additional details</h2>
                <div className="border-t divide-y divide-gray-200">
                  <div className="py-6">
                    <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </div>
                  <div className="py-6">
                    <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">
                        Free shipping on orders over $100. Returns accepted within 30 days of delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
