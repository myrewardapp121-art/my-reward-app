import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Share2, Copy, Users, Compass, Megaphone, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Referral() {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralCode = currentUser?.referralCode || 'AHMA3841';
  const referralLink = `${window.location.origin}/login?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast('Referral code copied to clipboard!', 'success');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast('Custom referral registration link copied!', 'info');
  };

  // Mock referred friends list
  const mockReferredFriends = [
    { name: 'Sajid Ali', city: 'Lahore', date: 'May 28, 2026', bonus: 150 },
    { name: 'Kamran Shah', city: 'Karachi', date: 'May 24, 2026', bonus: 150 },
    { name: 'Sidra Batool', city: 'Islamabad', date: 'May 22, 2026', bonus: 150 }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Refer & Earn" />

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#1A1A2E] to-[#12121A] border border-[#D4AF37]/20 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/5 blur-2xl rounded-full" />
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3">
            <Megaphone className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-serif text-gray-100">Invite Friends, Earn Millions</h2>
          <p className="text-xs text-gray-400 mt-2 max-w-[270px] leading-relaxed">
            Invite your Pakistani friends to register. You get <strong>🪙 150 Coins</strong> when they sign up, and they immediately claim <strong>🪙 50 Coins</strong> starting balance!
          </p>
        </div>

        {/* Copy Box */}
        <Card variant="gold" className="p-5 text-center">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest block mb-2"> Your Unique Invitation Code</span>
          
          <div className="flex items-center gap-2.5 bg-black/50 p-2.5 rounded-xl border border-gray-900 justify-between mb-4">
            <span className="text-lg font-mono font-bold tracking-widest text-[#D4AF37] select-all pl-3.5">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-2.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg border border-[#D4AF37]/20 active:scale-95 transition-all outline-none"
            >
              {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <Button
            onClick={handleCopyLink}
            variant="navy"
            iconBefore={<Share2 className="w-4 h-4" />}
            className="w-full text-xs font-bold tracking-wide uppercase"
          >
            Copy Registration Invite Link
          </Button>
        </Card>

        {/* Referral stats */}
        <div className="grid grid-cols-2 gap-3.5 text-center">
          <Card className="py-3 px-2">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Total Referred</span>
            <span className="text-xl font-serif font-bold text-gray-100 block mt-1">3 Friends</span>
          </Card>
          <Card className="py-3 px-2 border-[#22C55E]/20 bg-[#12121A]">
            <span className="text-[9px] text-[#22C55E] font-bold uppercase tracking-wider block">Referral Earnings</span>
            <span className="text-xl font-serif font-bold text-[#22C55E] block mt-1">🪙 450 Coins</span>
          </Card>
        </div>

        {/* Referred list ledger */}
        <div className="text-left pb-4">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-2.5 pl-2 border-l-2 border-[#D4AF37] font-serif">Referral Downline Network</h3>
          
          <Card variant="default" className="py-2.5 px-3.5 space-y-2.5 divide-y divide-gray-900">
            {mockReferredFriends.map((f, id) => (
              <div key={id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-200">{f.name}</p>
                  <p className="text-[9px] text-gray-500 font-medium">📍 {f.city} • Joined {f.date}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#22C55E]">
                  +🪙 {f.bonus}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
