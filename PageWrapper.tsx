import { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center p-0 md:p-4">
      {/* Visual device bezel for desktop viewports */}
      <div className="w-full max-w-[430px] min-h-screen md:min-h-[850px] md:h-[85vh] bg-[#0A0A0F] border border-gray-900/60 md:rounded-[36px] flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Notch detail */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-[16px] z-50 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-1 bg-gray-800 rounded-full" />
          </div>
        </div>
        
        {/* Content Shell */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col h-full overflow-hidden select-none"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
