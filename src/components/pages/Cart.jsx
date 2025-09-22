import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <Empty
            title="Your cart is empty"
            description="Looks like you haven't added any products to your cart yet. Start shopping to fill it up!"
            actionLabel="Continue Shopping"
            onAction={() => navigate("/")}
            icon="ShoppingCart"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Clear Cart
            </Button>
            <Link to="/">
              <Button variant="secondary">
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <CartItem
                key={`${item.productId}-${index}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                className="animate-fade-in"
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="gradient-text">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {shipping > 0 && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Truck" size={16} className="text-accent" />
                    <span className="text-sm text-accent font-medium">
                      Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                    </span>
                  </div>
                </div>
              )}
              
              <Button onClick={handleCheckout} size="lg" className="w-full mb-4">
                <ApperIcon name="CreditCard" size={20} className="mr-2" />
                Proceed to Checkout
              </Button>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Shield" size={14} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="RotateCcw" size={14} />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-success/5 to-emerald-50 rounded-lg">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
              <p className="text-sm text-gray-600">SSL encrypted payment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Truck" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
              <p className="text-sm text-gray-600">2-3 business days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/5 to-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <ApperIcon name="RotateCcw" size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;