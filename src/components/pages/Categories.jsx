import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { useCart } from "@/hooks/useCart";

const Categories = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryName || "");
  const [sortBy, setSortBy] = useState("name");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getAll(),
        selectedCategory 
          ? productService.getByCategory(selectedCategory)
          : productService.getAll()
      ]);
      
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      navigate(`/category/${category.toLowerCase()}`);
    } else {
      navigate("/categories");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => b.Id - a.Id);
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const sortedProducts = sortProducts(products);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory ? selectedCategory : "All Products"}
          </h1>
          <p className="text-xl text-gray-600">
            {selectedCategory 
              ? `Browse our ${selectedCategory.toLowerCase()} collection`
              : "Discover our complete product catalog"
            }
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {sortedProducts.length} products
              {selectedCategory && ` in ${selectedCategory}`}
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={sortedProducts}
          loading={loading}
          error={error}
          onRetry={loadData}
          onAddToCart={handleAddToCart}
          emptyTitle={selectedCategory ? `No products found in ${selectedCategory}` : "No products found"}
          emptyDescription={selectedCategory ? "Try browsing other categories or check back soon for new arrivals." : "We're working on adding more products. Check back soon!"}
        />
      </div>
    </div>
  );
};

export default Categories;