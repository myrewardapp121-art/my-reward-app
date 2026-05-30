import { cn } from '../../lib/utils';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'round' | 'rectangular';
}

export default function LoadingSkeleton({
  className,
  variant = 'rectangular'
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 bg-size-200",
        variant === 'text' && 'h-4 rounded w-3/4',
        variant === 'round' && 'rounded-full',
        variant === 'rectangular' && 'rounded-[12px]',
        className
      )}
      style={{
        animationDuration: '2s',
        backgroundImage: 'linear-gradient(90deg, #12121A 25%, #1A1A2E 50%, #12121A 75%)',
        backgroundSize: '200% 100%'
      }}
    />
  );
}
