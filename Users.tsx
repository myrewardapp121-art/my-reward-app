import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { formatCoins } from '../../lib/utils';
import { Users, Search, ShieldCheck, ArrowLeft, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';

export default function AdminUsers() {
  const { currentUser, adminToggleUserAdmin, adminUpdateUserBalance } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [balanceInps, setBalanceInps] = useState<Record<string, string>>({});

  // Core Mock Users Registry database list
  const mockUsers = [
    { id: currentUser?.id || 'usr-PK', name: currentUser?.fullName || 'Ahmad Shah', phone: currentUser?.phoneNumber || '03001234567', coins: currentUser?.coinBalance || 1500, status: 'Active', isAdmin: currentUser?.isAdmin || false },
    { id: 'usr-4412', name: 'Imran Bashir', phone: '03459998812', coins: 900, status: 'Active', isAdmin: false },
    { id: 'usr-9283', name: 'Sidra Batool', phone: '03126782390', coins: 4100, status: 'Active', isAdmin: false },
    { id: 'usr-5521', name: 'Yasir Khan', phone: '03334512938', coins: 250, status: 'Suspended', isAdmin: false }
  ];

  const handleUpdateBalanceSubmit = (userId: string) => {
    const rawVal = balanceInps[userId];
    const amount = Number(rawVal);
    if (Number.isNaN(amount) || amount < 0) {
      toast('Please enter a valid balance number', 'warning');
      return;
    }

    adminUpdateUserBalance(userId, amount);
    toast(`User balance successfully set to 🪙 ${formatCoins(amount)}`, 'success');
    
    // Clear input
    setBalanceInps(prev => ({ ...prev, [userId]: '' }));
  };

  const handleRoleToggle = (userId: string, currentAdmin: boolean) => {
    adminToggleUserAdmin(userId);
    toast(`User administrator privileges ${currentAdmin ? 'revoked' : 'granted'}!`, 'info');
  };

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.phone.includes(searchQuery)
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="System Users" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      {/* Main View */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        {/* Search Input bar */}
        <Input
          placeholder="Search by Name or Phone (03xx)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          iconBefore={<Search className="w-4 h-4 text-gray-500" />}
          className="h-10 py-1 font-sans text-xs border-gray-900"
        />

        {/* Users Loop cards list */}
        <div className="space-y-3">
          {filteredUsers.map((usr) => {
            return (
              <Card key={usr.id} className="p-4 bg-[#12121A] border-gray-900">
                <div className="flex items-start justify-between pb-3.5 border-b border-gray-900">
                  <div className="text-left space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-sans">
                      {usr.name} {usr.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/10" />}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono">ID: {usr.id} • {usr.phone}</p>
                  </div>
                  
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-sans tracking-wide
                    ${usr.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}
                  `}>
                    {usr.status}
                  </span>
                </div>

                {/* Adjustments row controls section */}
                <div className="pt-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-bold block">Coin balances:</span>
                    <strong className="text-[#D4AF37] font-serif font-bold">🪙 {formatCoins(usr.coins)} Coins</strong>
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      placeholder="New Balance..."
                      type="number"
                      value={balanceInps[usr.id] || ''}
                      onChange={(e) => setBalanceInps(prev => ({ ...prev, [usr.id]: e.target.value }))}
                      className="h-9 w-1/2 bg-black border border-gray-900 text-xs px-2.5 outline-none focus:border-[#D4AF37] rounded-lg text-white"
                    />
                    
                    <button
                      onClick={() => handleUpdateBalanceSubmit(usr.id)}
                      className="p-2 py-2 bg-[#D4AF37] text-black font-extrabold text-[10px] rounded-lg tracking-wider transition-all hover:scale-[1.01] outline-none active:scale-95 cursor-pointer flex-1"
                    >
                      Update Balance
                    </button>
                  </div>

                  <button
                    onClick={() => handleRoleToggle(usr.id, usr.isAdmin)}
                    className="w-full h-8 bg-[#1A1A2E]/50 hover:bg-[#1A1A2E] text-xs font-medium border border-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors outline-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🛡️</span> {usr.isAdmin ? 'Revoke Administrator' : 'Promote to Administrator'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
