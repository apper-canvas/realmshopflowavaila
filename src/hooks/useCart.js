import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("shopflow-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (!isLoading) {
      localStorage.setItem("shopflow-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === product.Id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex !== -1) {
      setCartItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      });
    } else {
      const newItem = {
        id: Date.now() + Math.random(),
        quantity: quantity,
        productId: product.Id,
        product: product,
        selectedOptions
      };
      setCartItems(prevItems => [...prevItems, newItem]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (productId, selectedOptions = {}) => {
    setCartItems(prevItems => {
      const filteredItems = prevItems.filter(
        item => !(item.productId === productId.toString() && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      );
      if (filteredItems.length < prevItems.length) {
        toast.info("Item removed from cart");
      }
      return filteredItems;
    });
  };

const updateQuantity = (productId, quantity, selectedOptions = {}) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedOptions);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.productId === productId && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)) {
          return { ...item, quantity: quantity };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shopflow-cart");
    toast.info("Cart cleared");
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

const getItemCount = (productId, selectedOptions = {}) => {
    const item = cartItems.find(
      item => item.productId === productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemCount
  };
};