import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  heightClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  heightClass = 'max-h-[85vh]'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center"
          >
            {/* Main bottom sheet container. Locked to max-w-[430px] for mobile-first visual shell */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full bg-[#12121A] border-t border-gray-800 rounded-t-[24px] overflow-hidden flex flex-col z-50",
                "max-w-[430px] mx-auto pb-safe shadow-2xl",
                heightClass
              )}
            >
              {/* Grab handle indicator */}
              <div className="flex justify-center py-2.5">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-900/50">
                <h3 className="text-lg font-semibold text-gray-100 font-serif tracking-wide">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 text-left">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
