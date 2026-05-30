import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { formatCoins } from '../../lib/utils';
import { Crown, Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Premium() {
  const { currentUser, spendCoins, updateProfile } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [purchasing, setPurchasing] = useState(false);

  const perks = [
    { title: 'Ad-Free Gaming Arena', desc: 'No sponsored ads inside Spin Wheels or Scratch Card lobbies.' },
    { title: '2x Coins Check-In Streak Multiplier', desc: 'Secure double coins on daily check-ins up to Year 2026.' },
    { title: 'Priority Golden Badge Review', desc: 'Redemptions processed inside a 4-hour Express VIP lane.' },
    { title: 'Exclusive Markhor Emblem Symbol', desc: 'Show off your digital patriotism with a gold crown on your card.' }
  ];

  const handleUnlockWithCoins = async () => {
    if (!currentUser) return;
    if (currentUser.isPremium) {
      toast('You are already a verified PREMIUM member! Enjoy maximum multipliers.', 'info');
      return;
    }

    const premiumCost = 10000; // 10,000 coins cost
    if (currentUser.coinBalance < premiumCost) {
      toast(`You need 🪙 10,000 coins to unlock Premium. You currently have 🪙 ${formatCoins(currentUser.coinBalance)}.`, 'error');
      return;
    }

    setPurchasing(true);
    
    setTimeout(async () => {
      // Deduct 10,000 coins
      const deducted = await spendCoins(premiumCost, 'Unlocked Lifelong PREMIUM Membership Pro', 'admin');
      if (deducted) {
        // Upgrade profile
        await updateProfile({ isPremium: true });
        toast('👑 Welcome to PREMIUM Pro! Your VIP benefits are active!', 'success');
      } else {
        toast('Upgrade failed. Check balances.', 'error');
      }
      setPurchasing(false);
    }, 1500);
  };

  const handleSimulatePayment = () => {
    setPurchasing(true);
    toast('Opening EasyPaisa payment gateway link...', 'info');

    setTimeout(async () => {
      await updateProfile({ isPremium: true });
      toast('👑 Easypaisa Payment Approved! Lifelong PREMIUM unlocked!', 'success');
      setPurchasing(false);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Rewards Premium" showBack={true} onBackClick={() => navigate('/profile')} />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-left">
        {/* Visual Crown header */}
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#12121A] via-[#1A1A2E] to-[#D4AF37]/15 border-2 border-[#D4AF37]/40 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-3xl rounded-full" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500/20 to-[#D4AF37]/30 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-3">
            <Crown className="w-9 h-9 fill-[#D4AF37] stroke-[1px] animate-bounce" />
          </div>
          <h2 className="text-xl font-bold font-serif text-gray-100 uppercase tracking-widest">Become Premium Pro</h2>
          <p className="text-[10px] text-gray-400 mt-1 max-w-[260px] mx-auto leading-normal">
             Support our local wallet initiative and multiply coin production 2x for life.
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-2 text-left bg-black/40 p-4 border border-gray-900 rounded-2xl relative">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
             VIP Perks Included
          </h3>
          
          <div className="space-y-3">
            {perks.map((p, index) => (
              <div key={index} className="flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-gray-200">{p.title}</h4>
                  <p className="text-[9px] text-gray-500 font-medium leading-normal mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase box controls */}
        <div className="space-y-3 pt-2 pb-6">
          {currentUser?.isPremium ? (
            <Card variant="gold" className="p-4 bg-gradient-to-r from-yellow-500/10 to-black text-center border-t border-b overflow-hidden select-none">
              <div className="text-semibold text-[#D4AF37] text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
                🏆 Verified VIP Pro Member Active
              </div>
            </Card>
          ) : (
            <>
              {/* Option 1: Buy with current coin balance */}
              <Card variant="gold" className="p-4 bg-[#12121A]/80 border-[#D4AF37]/35 flex flex-col items-center shadow-md">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Option A: Pay with Coins</span>
                <p className="text-xs text-center text-gray-400 mt-1 leading-normal max-w-[260px]">
                  Spend <strong>🪙 10,000 Coins</strong> from your available wallet balances to unlock.
                </p>
                <Button
                  onClick={handleUnlockWithCoins}
                  loading={purchasing}
                  variant="gold"
                  className="mt-3.5 w-full font-bold uppercase text-xs h-10 tracking-widest !rounded-lg"
                >
                  Buy with 10k Coins
                </Button>
              </Card>

              {/* Option 2: Buy with direct cash */}
              <Card variant="default" className="p-4 bg-black/55 border-gray-800 flex flex-col items-center">
                <span className="text-[10px] text-[#4F8EF7] font-bold uppercase tracking-wider">Option B: Cash billing</span>
                <p className="text-xs text-center text-gray-400 mt-1 leading-normal">
                   Direct checkout via local EasyPaisa / JazzCash payment links.
                </p>
                <div className="text-sm font-bold font-serif text-[#4F8EF7] mt-1.5">₨ 300 PKR / One-time</div>
                <Button
                  onClick={handleSimulatePayment}
                  loading={purchasing}
                  variant="navy"
                  className="mt-3 w-full font-bold uppercase text-xs h-10 tracking-widest !rounded-lg"
                >
                  Unlock via EasyPaisa
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
