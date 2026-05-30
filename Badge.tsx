import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'locked' | 'completed' | 'active' | 'inactive';
  children?: ReactNode;
  className?: string;
}

export default function Badge({ status, children, className }: BadgeProps) {
  const styles = {
    pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    approved: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    completed: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    rejected: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    locked: 'bg-gray-800 text-gray-500 border-gray-700/50',
    active: 'bg-[#4F8EF7]/10 text-[#4F8EF7] border-[#4F8EF7]/20',
    inactive: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  };

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    locked: 'Locked',
    active: 'Active',
    inactive: 'Inactive',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase',
        styles[status],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {children || labels[status]}
    </span>
  );
}
