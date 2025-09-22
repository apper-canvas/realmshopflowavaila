import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const totalItems = getTotalItems();

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">ShopFlow</span>
          </Link>

          {/* Desktop Navigation */}
<nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/categories" 
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              to="/deals" 
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Deals
            </Link>
            <Link 
              to="/new-arrivals" 
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              New Arrivals
            </Link>
            <Link 
              to="/order-history" 
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Order History
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon - Mobile */}
            <button className="lg:hidden text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="Search" size={24} />
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce-subtle">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            <button className="text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="User" size={24} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40">
          <div className="bg-white/95 backdrop-blur-md p-6 shadow-2xl">
<nav className="flex flex-col gap-4">
              <Link 
                to="/categories" 
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/deals" 
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                to="/new-arrivals" 
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                to="/order-history" 
                className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Order History
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;