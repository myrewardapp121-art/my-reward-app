import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { 
  User, 
  Crown, 
  Settings, 
  HelpCircle, 
  Lock, 
  ShieldAlert, 
  LogOut, 
  Bell, 
  ChevronRight, 
  BookOpen, 
  Coins 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Profile() {
  const { currentUser, logout } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast('Logged out successfully', 'success');
    navigate('/login');
  };

  const navItems = [
    { name: 'Ad Campaigns & Premium', path: '/premium', icon: Crown, color: 'text-[#D4AF37]' },
    { name: 'Notification Center', path: '/notifications', icon: Bell, color: 'text-[#4F8EF7]' },
    { name: 'Terms of Service', path: '/terms', icon: BookOpen, color: 'text-gray-400' },
    { name: 'Privacy Policy', path: '/privacy-policy', icon: HelpCircle, color: 'text-gray-400' },
    { name: 'Admin Console Doorway', path: '/admin/login', icon: ShieldAlert, color: 'text-red-500' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Your Profile" />

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Profile Card Header */}
        <Card variant="default" className="p-5 text-center relative overflow-hidden text-center border-gray-900 bg-[#12121A]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4F8EF7]/5 blur-2xl rounded-full" />
          
          <div className="mx-auto w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#1A1A2E] to-[#4F8EF7]/20 border border-[#4F8EF7]/40 flex items-center justify-center text-3xl shadow-lg mb-3">
            {currentUser?.avatarUrl || '🐐'}
          </div>

          <h3 className="text-xl font-bold font-serif text-gray-100 flex items-center justify-center gap-1.5">
            {currentUser?.fullName || 'User'}
            {currentUser?.isPremium && (
              <span className="text-xs text-[#D4AF37] vertical-middle inline-block">👑</span>
            )}
          </h3>

          <p className="text-xs text-gray-500 mt-1 font-mono">{currentUser?.phoneNumber || '03001234567'}</p>

          <div className="mt-3.5 flex justify-center gap-2">
            {currentUser?.isPremium ? (
              <Badge status="approved">PREMIUM LIFE</Badge>
            ) : (
              <Badge status="pending">REGULAR WALLET</Badge>
            )}
            <Badge status="active">PKR DOMICILE</Badge>
          </div>
        </Card>

        {/* Profile Stats rows */}
        <div className="grid grid-cols-2 gap-3.5 text-center">
          <Card className="py-3 px-1.5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Wallet Address</span>
            <span className="text-xs font-mono font-medium text-gray-300 block mt-1 select-all truncate px-1">
              {currentUser?.walletAddress || '0x4F8EF7CC'}
            </span>
          </Card>
          <Card className="py-3 px-1.5 border-[#D4AF37]/20">
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Account Balance</span>
            <span className="text-sm font-bold text-[#D4AF37] block mt-1">
              🪙 {new Intl.NumberFormat('en-PK').format(currentUser?.coinBalance || 0)} Coins
            </span>
          </Card>
        </div>

        {/* Navigation list selection */}
        <div className="text-left py-2.5">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-3 pl-2.5 border-l-2 border-[#D4AF37] font-serif">Quick Actions & Setup</h3>
          
          <Card variant="glass" className="p-0 border-gray-900 bg-wallet-card divide-y divide-gray-900/60 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-between p-4 bg-[#12121A]/40 hover:bg-[#1A1A2E]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors font-sans">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors" />
                </div>
              );
            })}
          </Card>
        </div>

        {/* Log Out button */}
        <Button
          onClick={handleLogout}
          variant="danger"
          iconBefore={<LogOut className="w-4.5 h-4.5" />}
          className="w-full tracking-wide uppercase font-bold text-xs"
        >
          Sign Out of Wallet
        </Button>

        <p className="text-[10px] text-center text-gray-600 pb-6">
          PakRewards v1.2.0 • Secured under Local Keys Sandbox Cryptography.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
