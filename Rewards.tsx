import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { formatCoins, coinsToPkr, formatPKR } from '../../lib/utils';
import { Gift, CreditCard, ChevronRight, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { RewardItem } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import CoinDisplay from '../../components/ui/CoinDisplay';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Rewards() {
  const { currentUser, rewards, redeemReward } = useApp();
  const { toast } = useToast();

  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startRedemption = (item: RewardItem) => {
    if (!currentUser) return;
    if (currentUser.coinBalance < item.costCoins) {
      toast(`You need at least 🪙 ${formatCoins(item.costCoins)} coins to request this payout.`, 'error');
      return;
    }
    setSelectedReward(item);
    setModalOpen(true);
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward || !currentUser) return;

    // Standard phone number validation
    const accountRegex = /^[0-9]{10,13}$/;
    if (!accountRegex.test(accountNumber)) {
      toast('Please enter a valid Account Number (10 to 11 digits)', 'warning');
      return;
    }

    if (!accountName.trim()) {
      toast('Please enter your Registered Account Name', 'warning');
      return;
    }

    setSubmitting(true);
    
    // Determine target category transfer method
    let method: 'easypaisa' | 'jazzcash' | 'uc' | 'mobile_load' = 'easypaisa';
    if (selectedReward.category === 'jazzcash') method = 'jazzcash';
    else if (selectedReward.category === 'pubg') method = 'uc';
    else if (selectedReward.category === 'mobile_load') method = 'mobile_load';

    try {
      const ok = await redeemReward(selectedReward.id, {
        method,
        accountNumber,
        accountName
      });

      if (ok) {
        toast(`Redemption Sent! ${selectedReward.title} is now under review.`, 'success');
        setModalOpen(false);
        setAccountNumber('');
        setAccountName('');
      } else {
        toast('Redemption request failed. Please check key balance.', 'error');
      }
    } catch (err) {
      toast('Redemption process aborted due to error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Redeem Rewards" />

      {/* Main viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* User balance check top display */}
        <Card variant="gold" className="p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest block">Your Balance</span>
            <span className="text-sm text-gray-500 mt-1 font-serif">Convert standard coins to cash</span>
          </div>
          <div className="text-right">
            <CoinDisplay coins={currentUser?.coinBalance || 0} size="md" showValueInPKR={true} />
          </div>
        </Card>

        {/* Withdrawal warning notice */}
        <div className="p-3 bg-gradient-to-r from-yellow-500/5 to-slate-900 border border-yellow-500/20 rounded-xl text-left">
          <p className="text-[10px] text-[#F59E0B] leading-relaxed flex items-start gap-1">
             <span>🛡️</span> All reward redemptions are verified by Pakistan admins before ledger payout completion within 24 working hours. Ensure correct accounts.
          </p>
        </div>

        {/* Rewards list */}
        <div className="text-left space-y-3 pb-8">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase pl-2 border-l-2 border-[#D4AF37] font-serif">Available Payouts</h3>

          <div className="grid grid-cols-1 gap-3">
            {rewards.map((item) => {
              const canAfford = currentUser ? currentUser.coinBalance >= item.costCoins : false;
              return (
                <div 
                  key={item.id}
                  onClick={() => startRedemption(item)}
                  className={`p-4 bg-[#12121A] border rounded-2xl flex items-center justify-between transition-all duration-150 relative cursor-pointer hover:bg-wallet-navy/10
                    ${canAfford ? 'border-[#D4AF37]/45' : 'border-gray-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1A1A2E] flex items-center justify-center text-2xl border border-gray-800">
                      {item.icon}
                    </div>
                    <div className="text-left max-w-[200px]">
                      <h4 className="text-xs font-bold text-gray-100">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 leading-normal">{item.description}</p>
                      
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D4AF37] font-mono font-bold bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          COINS: {formatCoins(item.costCoins)}
                        </span>
                        <span className="text-[9px] text-gray-500 capitalize">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-1 px-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-800 active:scale-95 transition-all text-[10px] font-bold">
                    Redeem
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom sheet Modal for confirmation */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedReward ? `Payout: ${selectedReward.title}` : 'Confirm Redemption'}
      >
        {selectedReward && (
          <form onSubmit={handleRedeemSubmit} className="space-y-4">
            <div className="bg-black/35 p-3.5 rounded-xl border border-gray-900 flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Cost Deduction</p>
                <p className="text-sm font-bold text-[#D4AF37] mt-1">🪙 {formatCoins(selectedReward.costCoins)} Coins</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Yield Value</p>
                <p className="text-sm font-bold text-green-500 mt-1">
                  {selectedReward.category.includes('paisa') || selectedReward.category.includes('cash') || selectedReward.category.includes('load') ? 'Cash PKR' : 'In-game UC'}
                </p>
              </div>
            </div>

            <Input
              label={
                selectedReward.category === 'pubg' ? 'Character ID (digits only/Username)'
                : selectedReward.category === 'mobile_load' ? 'Mobile Carrier Number'
                : 'EasyPaisa/JazzCash Account Number'
              }
              placeholder={selectedReward.category === 'pubg' ? 'e.g. 5293848123' : 'e.g. 03001234567'}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />

            <Input
              label="Account Holder / Character Name"
              placeholder="e.g. Muhammad Ahmad"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gold"
              loading={submitting}
              className="w-full tracking-wide uppercase font-bold"
            >
              Verify & Request Review
            </Button>
            
            <p className="text-[10px] text-center text-gray-500 leading-tight">
              By confirming, you authorize PakRewards to deduct 🪙 {formatCoins(selectedReward.costCoins)} coins. Double check details!
            </p>
          </form>
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}
