import React from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry, 
  onAddToCart,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your search or browse our categories.",
  className = "" 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry} 
        className={className} 
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <Empty 
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={onAddToCart}
          className="animate-fade-in"
        />
      ))}
    </div>
  );
};

export default ProductGrid;