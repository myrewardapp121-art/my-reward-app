import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold' | 'navy';
  loading?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  children?: ReactNode;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  loading = false,
  disabled = false,
  iconBefore,
  iconAfter,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 outline-none select-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm px-5 py-3 h-12 w-full text-center';

  const variants = {
    primary: 'bg-[#4F8EF7] hover:bg-[#3d7ee6] text-white focus:ring-[#4F8EF7]',
    secondary: 'bg-[#1A1A2E] hover:bg-[#252542] text-gray-200 border border-gray-800 focus:ring-[#1a1a2e]',
    danger: 'bg-[#EF4444] hover:bg-[#dc2626] text-white focus:ring-[#EF4444]',
    ghost: 'bg-transparent hover:bg-gray-900 text-gray-400 hover:text-white',
    gold: 'bg-[#D4AF37] hover:bg-[#be9b2e] text-black font-semibold focus:ring-[#D4AF37]',
    navy: 'bg-[#1A1A2E] hover:bg-[#20203a] text-[#4F8EF7] border border-[#4F8EF7]/30 focus:ring-[#4F8EF7]'
  };

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      disabled={disabled || loading}
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2 w-full">
          {iconBefore && <span className="flex-shrink-0">{iconBefore}</span>}
          {children}
          {iconAfter && <span className="flex-shrink-0">{iconAfter}</span>}
        </span>
      )}
    </motion.button>
  );
}
