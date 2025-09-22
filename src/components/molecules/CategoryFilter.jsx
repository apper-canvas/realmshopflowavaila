import React from "react";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => onCategoryChange("")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          selectedCategory === "" 
            ? "bg-primary text-white shadow-lg" 
            : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
        )}
      >
        All Categories
      </button>
      
      {categories.map((category) => (
        <button
          key={category.Id}
          onClick={() => onCategoryChange(category.name)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selectedCategory === category.name 
              ? "bg-primary text-white shadow-lg" 
              : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
          )}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-75">
            ({category.productCount})
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;