import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Wallet, Coins, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function OnboardingWallet() {
  const { currentUser, addCoins } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClaimWalletCoins = async () => {
    setLoading(true);
    toast('Generating secure wallet address hash keys...', 'info');

    setTimeout(async () => {
      // Depositing registration gift
      await addCoins(100, 'Claimed Welcome Wallet Gift Coins');
      toast('🪙 Welcome Gift Deposited! PWA Wallet Activated.', 'success');
      setLoading(false);
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8 overflow-y-auto bg-[#0A0A0F]">
      <div className="mt-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
          <Wallet className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-gray-100">Activate Your Wallet Keys</h2>
        <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
           Your account is ready! Create your personal localized cryptocurrency secure hashes under peer-to-peer sandboxes.
        </p>
      </div>

      <div className="my-6">
        <Card variant="gold" className="p-5 text-center">
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">Gift Available</span>
          <p className="text-2xl font-serif font-bold text-gray-100">🪙 100 Starter Coins</p>
          <div className="text-[10px] text-gray-500 font-mono mt-2 block tracking-tight truncate leading-relaxed">
            Local device wallet keys: <br />
            <strong className="text-gray-300">0xPK_92_REWARD_SECURE_KEYS_VAULT</strong>
          </div>
        </Card>
      </div>

      <Button
        onClick={handleClaimWalletCoins}
        loading={loading}
        variant="gold"
        iconAfter={<ChevronRight className="w-5 h-5" />}
        className="w-full tracking-wide uppercase font-bold"
      >
        Claim Gift & Enter Home
      </Button>
    </div>
  );
}
