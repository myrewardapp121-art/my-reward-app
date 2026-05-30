import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, iconBefore, iconAfter, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full text-left mb-4">
        {label && (
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {iconBefore && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              {iconBefore}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full h-12 bg-[#12121A] border rounded-xl px-4 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200",
              "border-gray-800 focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]",
              iconBefore ? "pl-10" : "",
              iconAfter ? "pr-10" : "",
              error ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]" : "",
              className
            )}
            {...props}
          />
          
          {iconAfter && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500">
              {iconAfter}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1 animate-pulse">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
