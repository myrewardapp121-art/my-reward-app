import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { formatPKR, coinsToPkr, formatCoins } from '../../lib/utils';
import { 
  Bell, 
  Crown, 
  Play, 
  Check, 
  Users, 
  Compass, 
  Flame, 
  Gift, 
  ChevronRight, 
  Zap, 
  Coins, 
  User, 
  Lock 
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CoinDisplay from '../../components/ui/CoinDisplay';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Home() {
  const { 
    currentUser, 
    transactions, 
    claimDailyStreak, 
    ads, 
    watchAd 
  } = useApp();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [adLoadingId, setAdLoadingId] = useState<string | null>(null);

  const handleClaimStreak = async () => {
    const success = await claimDailyStreak();
    if (success) {
      toast('Daily Check-In Claimed! Bonus coins added to your wallet.', 'success');
    } else {
      toast('You have already claimed your Daily Check-In streak today. Come back tomorrow!', 'warning');
    }
  };

  const handleWatchAd = (adId: string, reward: number) => {
    setAdLoadingId(adId);
    toast('Opening Video Player... Appending rewards in 3s', 'info');
    
    setTimeout(async () => {
      const ok = await watchAd(adId);
      if (ok) {
        toast(`Congratulations! You received +🪙 ${reward} for watching the ad.`, 'success');
      }
      setAdLoadingId(null);
    }, 3000);
  };

  // Safe checks
  const currentCoins = currentUser?.coinBalance || 0;
  const currentStreak = currentUser?.dailyStreak || 1;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      {/* Dynamic Header */}
      <Header
        title="Rewards Wallet"
        rightAction={
          <div className="flex items-center gap-2">
            {currentUser?.isPremium ? (
              <Badge status="approved" className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] px-2 py-0.5 border border-[#D4AF37]/35 mr-1 text-center font-bold">
                PRO 👑
              </Badge>
            ) : (
              <button 
                onClick={() => navigate('/premium')}
                className="p-1 px-2.5 bg-gradient-to-r from-[#D4AF37] to-[#eac552] text-black text-[10px] items-center gap-1 font-bold rounded-lg transition-transform active:scale-95 flex outline-none"
              >
                <Crown className="w-3 h-3 fill-black text-black" /> Pro
              </button>
            )}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 relative hover:text-white"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full animate-ping" />
            </button>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Profile Card & Balance Box */}
        <Card variant="gold" className="p-5 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1A1A2E] to-[#4F8EF7]/20 border border-[#4F8EF7]/40 flex items-center justify-center text-2xl shadow">
                {currentUser?.avatarUrl || '🐐'}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Khush Amdeed 👋</p>
                <h3 className="text-base font-bold text-gray-100 truncate max-w-[150px] font-sans">
                  {currentUser?.fullName || 'User'}
                </h3>
              </div>
            </div>
            {/* Wallet details */}
            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-500 block uppercase tracking-wider">Account ID</span>
              <span className="text-[10px] font-mono text-gray-300 font-medium bg-black/40 px-2 py-0.5 rounded-md border border-gray-900">
                {currentUser?.id || 'usr-PK'}
              </span>
            </div>
          </div>

          {/* Main big numbers display */}
          <div className="flex flex-col items-center py-4 bg-black/40 border border-gray-900 rounded-2xl relative mb-1.5 shadow-inner">
            <span className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-widest">Available Balance</span>
            <CoinDisplay coins={currentCoins} size="lg" showValueInPKR={true} />
          </div>
        </Card>

        {/* Daily Streak Check-In Panel */}
        <Card variant="navy" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 flex items-center justify-center z-10">
              <Flame className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-gray-200">Checking-In (Streak)</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">🔥 Daily Streak Days: <strong className="text-white font-serif">{currentStreak}</strong></p>
            </div>
          </div>
          <button
            onClick={handleClaimStreak}
            className="px-3.5 py-1.8 bg-[#F59E0B] text-black font-bold font-sans text-xs rounded-xl hover:bg-[#e08f0a] transition-colors outline-none cursor-pointer flex items-center gap-1 shadow-md"
          >
            <Check className="w-3.5 h-3.5 stroke-[3px]" /> Claim Check
          </button>
        </Card>

        {/* Explore Games row */}
        <div className="text-left">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase border-l-2 border-[#4F8EF7] pl-2 font-serif">Interactive Rewards Games</h3>
            <span onClick={() => navigate('/games')} className="text-xs text-[#4F8EF7] hover:underline cursor-pointer flex items-center">
              All Games <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Spin Wheel', route: '/games/spin', emoji: '🎡', color: 'border-yellow-600/30' },
              { name: 'Scratch Card', route: '/games/scratch', emoji: '🪙', color: 'border-blue-600/30' },
              { name: 'Islamic Quiz', route: '/games/quiz', emoji: '🕌', color: 'border-green-600/30' },
            ].map((gm) => (
              <motion.div
                key={gm.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(gm.route)}
                className={`py-3.5 px-3 bg-[#12121A] border ${gm.color} rounded-2xl flex flex-col items-center justify-center hover:bg-wallet-navy/20 cursor-pointer shadow-md`}
              >
                <span className="text-2xl mb-1.5">{gm.emoji}</span>
                <span className="text-[10px] font-bold text-gray-300 font-sans tracking-wide text-center leading-snug">
                  {gm.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Watch High-Paying Sponsored Ad Block */}
        <div className="text-left">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-2.5 border-l-2 border-green-500 pl-2 font-serif">Quick Sponsored Ad Breaks</h3>
          
          <div className="space-y-2.5">
            {ads.filter(a => a.status === 'active').slice(0, 2).map((ad) => (
              <div 
                key={ad.id}
                className="p-3.5 bg-[#12121A] border border-gray-900 rounded-2xl flex items-center justify-between shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left max-w-[200px]">
                    <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{ad.title}</h4>
                    <span className="text-[9px] text-[#22C55E] flex items-center gap-1 font-mono font-medium mt-1">
                      🪙 +{ad.rewardCoins} Coins • ⏱️ {ad.durationSeconds}s
                    </span>
                  </div>
                </div>
                
                <Button
                  loading={adLoadingId === ad.id}
                  onClick={() => handleWatchAd(ad.id, ad.rewardCoins)}
                  className="h-9 px-3 w-auto min-w-[75px] rounded-xl text-xs bg-gradient-to-r from-[#22C55E] to-[#15803d]"
                >
                  <Zap className="w-3.5 h-3.5 fill-current mr-0.5" /> Watch
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions ledger */}
        <div className="text-left">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-2.5 border-l-4 border-[#D4AF37] pl-2 font-serif">Recent Ledger Records</h3>
          
          <Card variant="default" className="py-2.5 px-3 space-y-1.5 divide-y divide-gray-900">
            {transactions.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">No recent record entries.</p>
            ) : (
              transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-2.5 first:pt-1 last:pb-1">
                  <div className="text-left max-w-[190px]">
                    <p className="text-xs font-medium text-gray-200 line-clamp-1 leading-snug">{tx.description}</p>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCoins(tx.amount)}
                    </span>
                    <Badge status={tx.status} className="text-[8px] py-0 px-1 border-none capitalize font-semibold" />
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Navigation footer tabs bar */}
      <BottomNav />
    </div>
  );
}
