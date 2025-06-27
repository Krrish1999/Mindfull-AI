import React, { forwardRef } from 'react';

type TextAreaProps = {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, helperText, error, fullWidth = false, rows = 4, className = '', ...props }, ref) => {
    const baseTextAreaClasses = "block rounded-md border py-2 px-3 shadow-sm focus:outline-none focus:ring-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500";
    const errorTextAreaClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
    const widthClass = fullWidth ? "w-full" : "";
    
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
        
        <textarea
          ref={ref}
          rows={rows}
          className={`${baseTextAreaClasses} ${error ? errorTextAreaClasses : ''} ${widthClass} ${className}`}
          {...props}
        />
        
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

TextArea.displayName = 'TextArea';