import React, { forwardRef } from 'react';

type InputProps = {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, fullWidth = false, className = '', ...props }, ref) => {
    const baseInputClasses = "rounded-md border py-2 px-3 shadow-sm focus:outline-none focus:ring-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500";
    const errorInputClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
    const widthClass = fullWidth ? "w-full" : "";
    const iconClass = icon ? "pl-10" : "";
    
    return (
      <div className={`${widthClass}`}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${iconClass} ${widthClass} ${className}`}
            {...props}
          />
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';