import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;