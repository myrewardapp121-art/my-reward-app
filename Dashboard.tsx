import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { formatCoins, coinsToPkr, formatPKR } from '../../lib/utils';
import { 
  ShieldAlert, 
  Users, 
  Coins, 
  Flag, 
  ArrowLeft, 
  Check, 
  X, 
  Settings, 
  Play, 
  Gamepad2, 
  FileText, 
  CheckCircle2, 
  ShieldX 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';

export default function AdminDashboard() {
  const { 
    currentUser, 
    transactions, 
    flags, 
    ads,
    adminLogout, 
    adminUpdateTransaction 
  } = useApp();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    toast('Admin session logged out safely.', 'info');
    navigate('/profile');
  };

  // Stats calculation
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const activeFlags = flags.filter(f => f.status === 'pending');
  
  const totalSystemUsers = 238; // Mocked active telemetry count
  const totalSystemCoins = 428900; // Mocked active coins pools

  const quickNav = [
    { name: 'Wallets & Users', path: '/admin/users', icon: Users, color: 'text-indigo-400' },
    { name: 'Fraud Watch Flags', path: '/admin/flags', icon: Flag, color: 'text-red-400' },
    { name: 'Ad Spot Banners', path: '/admin/ads', icon: Play, color: 'text-emerald-400' },
    { name: 'Game Odds Control', path: '/admin/games', icon: Gamepad2, color: 'text-yellow-400' },
    { name: 'Tasks Registry', path: '/admin/tasks', icon: FileText, color: 'text-blue-400' },
    { name: 'System Settings', path: '/admin/settings', icon: Settings, color: 'text-pink-400' }
  ];

  const handleApprove = (id: string, amount: number) => {
    adminUpdateTransaction(id, 'completed');
    toast(`Redemption transaction ${id} has been Approved & paid!`, 'success');
  };

  const handleReject = (id: string) => {
    adminUpdateTransaction(id, 'rejected');
    toast(`Redemption transaction ${id} has been rejected and coins refunded.`, 'warning');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header
        title="Admin Control Room"
        showBack={true}
        onBackClick={() => navigate('/profile')}
        rightAction={
          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950/80 text-red-500 rounded-lg text-xs font-bold border border-red-900/60 transition-colors"
          >
            Logout
          </button>
        }
      />

      {/* Main Grid Viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-left pb-10">
        
        {/* Telemetry Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-gradient-to-tr from-[#12121A] to-indigo-950/30 border-indigo-900/40">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Est. System Registrations</span>
            <span className="text-lg font-serif font-bold text-gray-200 mt-1 block">{totalSystemUsers} Users</span>
          </Card>
          
          <Card className="p-3 bg-gradient-to-tr from-[#12121A] to-yellow-950/20 border-yellow-800/40">
            <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider block">Active System Coins Pool</span>
            <span className="text-lg font-serif font-bold text-[#D4AF37] mt-1 block">🪙 {formatCoins(totalSystemCoins)}</span>
          </Card>

          <Card className="p-3 border-orange-500/20">
            <span className="text-[9px] text-[#F59E0B] font-bold uppercase tracking-wider block">Pending Redemptions</span>
            <span className="text-lg font-serif font-bold text-orange-400 mt-1 block">{pendingTransactions.length} Pending</span>
          </Card>

          <Card className="p-3 border-red-500/20">
            <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider block">Flagged Fraud Reports</span>
            <span className="text-lg font-serif font-bold text-red-400 mt-1 block">{activeFlags.length} Flags</span>
          </Card>
        </div>

        {/* Quick Nav subpages */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase pl-2 border-l-2 border-[#D4AF37] font-serif">Administrative Core Modules</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {quickNav.map((qn) => {
              const Icon = qn.icon;
              return (
                <div
                  key={qn.name}
                  onClick={() => navigate(qn.path)}
                  className="p-3.5 bg-[#12121A] border border-gray-900 rounded-xl hover:border-gray-800 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-3.5"
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${qn.color}`} />
                  <span className="text-[10px] font-extrabold text-gray-300 font-sans tracking-wide leading-tight">
                    {qn.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Audits area */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase pl-2 border-l-2 border-red-500 font-serif">Pending Transfers Audit</h3>
          
          <div className="space-y-2.5">
            {pendingTransactions.length === 0 ? (
              <Card className="p-6 text-center select-none text-gray-600 bg-[#12121A] border-gray-900">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E]/30 mx-auto mb-2" />
                <p className="text-xs">No pending redemptions present inside audit queue. Ledger is green.</p>
              </Card>
            ) : (
              pendingTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="p-4 bg-[#12121A] border border-orange-500/20 rounded-2xl flex flex-col items-stretch text-xs space-y-3 shadow"
                >
                  <div className="flex justify-between items-start text-xs border-b border-gray-900 pb-2.5">
                    <div className="text-left w-2/3">
                      <p className="font-bold text-gray-200 line-clamp-1 leading-normal">{tx.description}</p>
                      <span className="text-[9px] text-gray-500 font-mono block mt-0.5">ID: {tx.id} • User: {tx.userId}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-red-500 font-mono tracking-tight block">
                        -🪙 {formatCoins(tx.amount)} Coins
                      </span>
                      <span className="text-[9px] text-[#4F8EF7] font-mono mt-0.5 block">
                        ≈ {formatPKR(coinsToPkr(tx.amount))} PKR
                      </span>
                    </div>
                  </div>

                  {/* Account detail slots */}
                  {tx.payoutDetails && (
                    <div className="p-2.5 bg-black/50 border border-gray-900 rounded-xl leading-normal text-left text-[10px] text-gray-300 space-y-1 font-mono">
                      <p>🏦 <strong className="text-gray-400">PROVIDER:</strong> <span className="uppercase text-[#D4AF37] font-bold">{tx.payoutDetails.method}</span></p>
                      <p>📞 <strong className="text-gray-400">NUMBER:</strong> <span className="text-white select-all font-bold">{tx.payoutDetails.accountNumber}</span></p>
                      <p>👤 <strong className="text-gray-400">HOLDER:</strong> <span className="text-white font-bold">{tx.payoutDetails.accountName}</span></p>
                    </div>
                  )}

                  {/* Immediate actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(tx.id, tx.amount)}
                      className="flex-1 py-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors outline-none cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Payout
                    </button>
                    
                    <button
                      onClick={() => handleReject(tx.id)}
                      className="py-2 px-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20 rounded-xl text-[10px] font-bold flex items-center justify-center transition-colors outline-none cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
