import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  variant?: 'default' | 'gold' | 'navy' | 'glass';
  hoverable?: boolean;
  children?: ReactNode;
}

export default function Card({
  children,
  className,
  variant = 'default',
  hoverable = false,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-[16px] p-5 transition-all duration-300 relative overflow-hidden';

  const variants = {
    default: 'bg-[#12121A] border border-gray-900/80',
    gold: 'bg-[#12121A] border-2 border-[#D4AF37] gold-glow',
    navy: 'bg-[#1A1A2E] border border-[#4F8EF7]/20 blue-glow',
    glass: 'glass-effect border border-white/10'
  };

  const hoverStyles = hoverable 
    ? 'hover:scale-[1.01] hover:border-wallet-blue/50 cursor-pointer shadow-black/40 shadow-lg' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      {...props}
    >
      {/* Visual background ambient details for cards */}
      {variant === 'gold' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-2xl rounded-full pointer-events-none" />
      )}
      {variant === 'navy' && (
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4F8EF7]/5 blur-2xl rounded-full pointer-events-none" />
      )}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
}
