import { Coins } from 'lucide-react';
import { cn, formatCoins, coinsToPkr, formatPKR } from '../../lib/utils';

export interface CoinDisplayProps {
  coins: number;
  showValueInPKR?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoinDisplay({
  coins,
  showValueInPKR = true,
  className,
  size = 'md'
}: CoinDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm gap-1 py-1 px-2.5 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5',
    md: 'text-base gap-1.5 py-1.5 px-3 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37]',
    lg: 'text-2xl gap-2 py-3 px-5 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] font-serif font-bold'
  };

  const iconSizes = {
    sm: 'w-4 h-4 text-[#D4AF37]',
    md: 'w-5 h-5 text-[#D4AF37]',
    lg: 'w-7 h-7 text-[#D4AF37] filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
  };

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className={cn("flex items-center font-bold tracking-tight", sizeClasses[size])}>
        <Coins className={cn(iconSizes[size], "animate-bounce")} style={{ animationDuration: '3s' }} />
        <span>🪙 {formatCoins(coins)} <span className="text-xs font-sans text-[#D4AF37]/75 font-normal">Coins</span></span>
      </div>
      {showValueInPKR && (
        <span className={cn(
          "text-gray-400 font-sans mt-1.5 font-medium block",
          size === 'sm' && "text-[10px], mt-0.5",
          size === 'md' && "text-xs",
          size === 'lg' && "text-sm text-[#4F8EF7]"
        )}>
          ≈ {formatPKR(coinsToPkr(coins))} PKR
        </span>
      )}
    </div>
  );
}
