import { NavLink } from 'react-router-dom';
import { Home, Compass, Gamepad2, Gift, User } from 'lucide-react';

export default function BottomNav() {
  const tabs = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Earn', path: '/earn', icon: Compass },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Rewards', path: '/rewards', icon: Gift },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full h-18 bg-[#12121A]/95 backdrop-blur-md border-t border-gray-900/60 pb-safe flex-shrink-0 flex items-center justify-around px-2 shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-2xl transition-all duration-200 outline-none
              ${isActive 
                ? 'text-[#D4AF37] scale-105 font-medium' 
                : 'text-gray-500 hover:text-gray-300'
              }
            `}
          >
            <Icon className="w-5.5 h-5.5 transition-transform duration-100" />
            <span className="text-[10px] tracking-wide uppercase font-sans font-semibold">
              {tab.name}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
