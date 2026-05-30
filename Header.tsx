import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  onBackClick?: () => void;
}

export default function Header({
  title,
  showBack = false,
  rightAction,
  onBackClick
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 pt-safe flex-shrink-0 flex items-center justify-between px-5 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-gray-900/45">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-1.5 bg-gray-900/60 hover:bg-[#1A1A2E] text-gray-300 hover:text-white rounded-xl border border-gray-800/40 active:scale-95 transition-all outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-bold font-serif text-gray-100 tracking-wide line-clamp-1">
          {title}
        </h1>
      </div>

      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
}
