import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { useCart } from "@/hooks/useCart";

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getFeaturedProducts(),
        categoryService.getAll()
      ]);
      
      setFeaturedProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 py-20 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text">Premium Products</span>
                  <br />
                  <span className="text-gray-900">Delivered Fast</span>
                </h1>
                <p className="text-xl text-gray-600 mt-6 max-w-lg">
                  Discover curated collections of quality products from trusted brands. 
                  Shop with confidence and enjoy exceptional service.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/categories">
                  <Button size="lg" className="w-full sm:w-auto">
                    <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/deals">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <ApperIcon name="Zap" size={20} className="mr-2" />
                    View Deals
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">1M+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">50K+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800"
                  alt="Shopping Experience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-accent to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-primary to-blue-600 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our carefully curated categories to find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.Id}
                to={`/category/${category.name.toLowerCase()}`}
                className="group card text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-blue-200 transition-all duration-300">
                  <ApperIcon name="Package" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.productCount} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our top-rated products loved by thousands of customers
            </p>
          </div>
          
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            error={error}
            onRetry={loadData}
            onAddToCart={handleAddToCart}
            emptyTitle="No featured products available"
            emptyDescription="Check back soon for our latest featured products."
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-success/10 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Truck" size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free delivery on orders over $50. Fast and reliable shipping to your doorstep.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Your payment information is protected with bank-level security and encryption.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent/10 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="RotateCcw" size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied? Return your purchase within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;