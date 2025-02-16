import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SearchBar = () => {
  const [query, setQuery] = useState(""); 
  const [results, setResults] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  useEffect(() => {

    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {

        const response = await axios.get(`${BASE_URL}/products/search`, {
          params: { query },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="relative">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zadejte hledaný výraz..."
        className="border-gray-100 rounded-lg px-4 py-2 w-96 bg-white shadow-md hover:bg-slate-50 transition-all"
      />

      {/* Results Dropdown */}
      <ul
        className={`absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-2 p-4 space-y-2 overflow-y-auto transition-all ${
          query && results.length > 0 ? "block fixed max-h-64 z-50" : "hidden"
        }`}
        style={{ width: "24rem" }} // Matches input width
      >
        {loading ? (
          <li className="text-gray-500">Načítání produktů...</li>
        ) : results.length === 0 ? (
          <li className="text-gray-500">Žádné výsledky...</li>
        ) : (
          results.map((product) => (
            <li
              key={product.id}
              className="py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
            >
              {product.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
