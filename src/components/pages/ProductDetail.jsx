import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productData = await productService.getById(id);
      const relatedData = await productService.getRelatedProducts(id);
      
      setProduct(productData);
      setRelatedProducts(relatedData);
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/checkout");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={20}
        className={index < Math.floor(rating) ? "text-amber-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Error message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <Error message="Product not found" />
      </div>
    );
  }

  const cartItemCount = getItemCount(product.Id);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button onClick={() => navigate("/categories")} className="hover:text-primary">
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-50">
              <img
                src={product.images?.[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {!product.inStock && (
                <div className="absolute top-4 left-4">
                  <Badge variant="error">Out of Stock</Badge>
                </div>
              )}
              {product.rating >= 4.5 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="success">Top Rated</Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? "border-primary shadow-lg" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge>{product.brand}</Badge>
                <span className="text-sm text-gray-600">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.rating}
                </span>
                <span className="text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold gradient-text">
                  ${product.price}
                </span>
                {product.inStock ? (
                  <Badge variant="success">
                    <ApperIcon name="Check" size={14} className="mr-1" />
                    In Stock ({product.stockQuantity} available)
                  </Badge>
                ) : (
                  <Badge variant="error">
                    <ApperIcon name="X" size={14} className="mr-1" />
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <label className="font-semibold text-gray-900">Quantity:</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-gray-600 hover:text-primary transition-colors"
                        disabled={quantity <= 1}
                      >
                        <ApperIcon name="Minus" size={16} />
                      </button>
                      <span className="font-semibold min-w-[3rem] text-center text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        className="text-gray-600 hover:text-primary transition-colors"
                        disabled={quantity >= product.stockQuantity}
                      >
                        <ApperIcon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="flex-1 relative"
                    >
                      <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                      Add to Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                    >
                      <ApperIcon name="Zap" size={20} className="mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose This Product?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Shield" size={20} className="text-success" />
                  <span className="text-gray-700">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Truck" size={20} className="text-success" />
                  <span className="text-gray-700">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="RotateCcw" size={20} className="text-success" />
                  <span className="text-gray-700">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Headphones" size={20} className="text-success" />
                  <span className="text-gray-700">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Related Products
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
            
            <ProductGrid
              products={relatedProducts}
              onAddToCart={addToCart}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;