interface ProductProps {
    name: string;
    description: string;
    price: number;
    reviews: number;
    rating: number;
    stock: number;
    image: string;
}

function ProductCard({ name, description, price, reviews, rating, stock, image }: ProductProps) {
    return (
        <div className="flex flex-col w-72 border rounded-md shadow-md p-4 bg-white">
            {/* Product Image */}
            <div className="flex justify-center">
                <img
                    src={image}
                    alt={name}
                    className="w-40 h-40 object-contain"
                />
            </div>
            <div className="mt-2">
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                {/* Description */}
                <p className="text-sm text-gray-600 mb-2">{description}</p>
                {/* Rating */}
                <div className="flex items-center mb-2">
                    <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <span
                                key={index}
                                className={`text-yellow-400 ${index < rating ? 'text-yellow-500' : 'text-gray-300'
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">({reviews}×)</span>
                </div>
                {/* Price and Button */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-red-600">{price.toLocaleString()} Kč</span>
                    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg- transition">
                        Do košíku
                    </button>
                </div>
                {/* Stock Info */}
                <span
                    className={`text-sm font-medium ${stock > 5 ? 'text-green-600' : stock > 0 ? 'text-yellow-500' : 'text-red-600'
                        }`}
                >
                    {stock > 0 ? `Skladem > ${stock} ks` : 'Není skladem'}
                </span>
            </div>
        </div>
    );
}

export default ProductCard;
