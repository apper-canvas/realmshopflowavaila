import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ product, onAddToCart, className = "" }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? "text-amber-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <div 
      className={`card cursor-pointer transform hover:scale-[1.02] transition-all duration-300 overflow-hidden ${className}`}
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute top-3 left-3">
            <Badge variant="error">Out of Stock</Badge>
          </div>
        )}
        {product.rating >= 4.5 && (
          <div className="absolute top-3 right-3">
            <Badge variant="success">Top Rated</Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold gradient-text">
              ${product.price}
            </span>
            {product.brand && (
              <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            size="sm"
            className={!product.inStock ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ApperIcon name="Plus" size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;