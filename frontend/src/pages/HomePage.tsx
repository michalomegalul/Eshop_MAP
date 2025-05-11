import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { getProductImageUrl, getCEOImageUrl, getFallbackImageUrl } from '../utils/imageUtils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await productService.getAllProducts({ per_page: 4 });
        setFeaturedProducts(products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Expert Diesel Repair & Quality Parts
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Welcome to Dieselpower, your trusted partner for professional diesel engine repair services and premium parts. Our experienced technicians ensure your vehicle runs at peak performance.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/products"
                    className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Browse Products
                  </Link>
                  <Link to="/services" className="text-sm font-semibold leading-6 text-gray-900">
                    Our Services <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
            src="https://images.unsplash.com/photo-1607400201515-c2c41c07d307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="Diesel engine repair"
          />
        </div>
      </div>

      {/* Featured Products section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Products</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Check out our popular products and exclusive deals.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="group relative animate-pulse">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-red-500">
            <p>{error}</p>
            <button 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={getProductImageUrl()}
                    alt={product.name}
                    className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                    onError={(e) => {
                      // If image fails to load, use fallback
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImageUrl();
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description?.substring(0, 60)}...</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Services section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Services</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We offer comprehensive diesel engine services by certified technicians.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Engine Diagnostics',
                description: 'Our advanced diagnostic equipment quickly identifies issues with your diesel engine.',
                icon: '🔍',
              },
              {
                title: 'Maintenance & Repair',
                description: 'Regular maintenance and expert repair services to keep your diesel engine running smoothly.',
                icon: '🔧',
              },
              {
                title: 'Performance Upgrades',
                description: 'Enhance your engine\'s performance with our custom upgrade services.',
                icon: '⚡',
              },
            ].map((service, index) => (
              <article key={index} className="flex flex-col items-start">
                <div className="flex items-center gap-x-4 text-xs">
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <span className="absolute inset-0"></span>
                    {service.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Customer Testimonials</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Don't just take our word for it — see what our customers have to say.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[
              {
                quote: "The team at Dieselpower completely transformed my truck's performance. Couldn't be happier with the service!",
                author: "Mike Johnson",
                title: "Ford F-350 Owner",
              },
              {
                quote: "Fast service and quality parts. My engine is running better than ever after their thorough maintenance service.",
                author: "Sarah Miller",
                title: "Dodge RAM Owner",
              },
              {
                quote: "I've been taking my vehicles to Dieselpower for years. Their expertise and customer service are unmatched in the industry.",
                author: "Robert Davis",
                title: "Fleet Manager",
              },
            ].map((testimonial, index) => (
              <div key={index} className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex-1">
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-300"
                      src={index === 0 ? getCEOImageUrl() : `/dan.jpg`}
                      alt={testimonial.author}
                      onError={(e) => {
                        // If image fails to load, use fallback
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackImageUrl();
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your diesel performance?</span>
            <span className="block text-xl mt-2">Get in touch with our experts today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-primary-600 hover:bg-gray-100"
              >
                Contact Us
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-700 px-5 py-3 text-base font-medium text-white hover:bg-primary-800"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
