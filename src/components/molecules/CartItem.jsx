import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove, className = "" }) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  const handleQuantityChange = (newQuantity) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.productId, newQuantity, item.selectedOptions);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.productId, item.selectedOptions);
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 ${className}`}>
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">
          {product.name}
        </h4>
        <p className="text-sm text-gray-600 truncate">
          {product.brand}
        </p>
        <p className="text-lg font-bold text-primary mt-1">
          ${product.price}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="text-gray-600 hover:text-primary transition-colors"
            disabled={quantity <= 1}
          >
            <ApperIcon name="Minus" size={16} />
          </button>
          <span className="font-semibold min-w-[2rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <ApperIcon name="Plus" size={16} />
          </button>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 transition-colors mt-1"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;