import { useNavigate } from 'react-router-dom';
import { Bell, Heart, Send, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Notifications() {
  const navigate = useNavigate();

  // Polished mock notifications list for wallet
  const notifications = [
    { id: 1, title: 'EasyPaisa Withdrawal Dispatched', body: 'Verification approved! PKR 100 transferred securely to Account ending 0300****567. Ref ID: #3842', time: '2 hours ago', type: 'success' },
    { id: 2, title: 'Weekly Mega Quiz Coupon Codes', body: 'Redeem coupon CODE "PAKISTANO" inside the Settings tab for an instant bonus of 🪙 100 Coins.', time: '1 day ago', type: 'info' },
    { id: 3, title: 'System Security Audit Completed', body: 'Our Supabase cloud vault upgraded ledger compliance. Your coin balances and character badges are safe under hardware cryptographic wraps.', time: '3 days ago', type: 'warning' },
    { id: 4, title: 'Ref-Code Viral Bonus Granted', body: 'Sajid Ali successfully created a wallet using your invitation code. 🪙 150 Coins were added to your check-ledger.', time: '5 days ago', type: 'success' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Notification Hub" showBack={true} onBackClick={() => navigate('/home')} />

      {/* Main View */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-8 text-left">
        {notifications.map((notif) => {
          return (
            <Card 
              key={notif.id}
              className={`p-4 border-l-4 relative overflow-hidden bg-[#12121A] border-gray-900
                ${notif.type === 'success' ? 'border-l-[#22C55E]' : ''}
                ${notif.type === 'info' ? 'border-l-[#4F8EF7]' : ''}
                ${notif.type === 'warning' ? 'border-l-[#F59E0B]' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center mt-0.5">
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex-1 text-left space-y-1">
                  <h4 className="text-xs font-bold text-gray-100">{notif.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">{notif.body}</p>
                  <span className="text-[9px] text-gray-600 font-mono italic block pt-1">{notif.time}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
