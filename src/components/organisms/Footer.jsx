import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ShopFlow</span>
            </Link>
            <p className="text-gray-400">
              Your premium destination for quality products and exceptional shopping experiences.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Facebook" size={20} />
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <ApperIcon name="Instagram" size={20} />
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <div className="space-y-2">
              <Link to="/categories" className="block hover:text-primary transition-colors">
                All Categories
              </Link>
              <Link to="/deals" className="block hover:text-primary transition-colors">
                Deals & Offers
              </Link>
              <Link to="/new-arrivals" className="block hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link to="/bestsellers" className="block hover:text-primary transition-colors">
                Best Sellers
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="block hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link to="/shipping" className="block hover:text-primary transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="block hover:text-primary transition-colors">
                Returns
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <div className="space-y-2">
              <Link to="/about" className="block hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/careers" className="block hover:text-primary transition-colors">
                Careers
              </Link>
              <Link to="/privacy" className="block hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400">
            © {currentYear} ShopFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <ApperIcon name="CreditCard" size={32} className="text-gray-400" />
            <ApperIcon name="Smartphone" size={32} className="text-gray-400" />
            <ApperIcon name="Shield" size={32} className="text-gray-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;