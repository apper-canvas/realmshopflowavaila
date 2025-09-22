import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProductGrid from "@/components/organisms/ProductGrid";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const query = searchParams.get("q") || "";

  const searchProducts = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const results = await productService.searchProducts(searchTerm);
      setProducts(results);
    } catch (err) {
      setError(err.message || "Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  const handleSearch = (searchTerm) => {
    setSearchParams({ q: searchTerm });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Search Products
          </h1>
          <div className="max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for products, brands, or categories..."
            />
          </div>
        </div>

        {/* Search Results */}
        {query && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-lg">
              <ApperIcon name="Search" size={20} className="text-gray-400" />
              <span className="text-gray-600">Search results for:</span>
              <span className="font-semibold text-gray-900">"{query}"</span>
            </div>
            {!loading && products.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Found {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {query ? (
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onRetry={() => searchProducts(query)}
            onAddToCart={handleAddToCart}
            emptyTitle="No products found"
            emptyDescription={`No products match "${query}". Try different keywords or browse our categories.`}
          />
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Start Your Search
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter keywords in the search bar above to find products, brands, or categories you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;