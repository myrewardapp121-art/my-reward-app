import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Terms of Service" showBack={true} onBackClick={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-left font-sans">
        <h3 className="text-base font-bold font-serif text-[#D4AF37]">1. Compliance and Legality</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          By registering a wallet with PakRewards, you confirm that you are a resident of Pakistan and use a verified local mobile operator (Telenor, Mobilink Jazz, Zong, or Ufone).
        </p>

        <h3 className="text-base font-bold font-serif text-[#D4AF37]">2. Coins and Value</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Coins represent digital reward values earned through game, streak, social tasks, or direct promotional activities. The current exchange coefficient is 10 Coins = 1 PKR, subject to tax adjustments and provider commission payouts.
        </p>

        <h3 className="text-base font-bold font-serif text-[#D4AF37]">3. Withdrawal Verifications</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          All EasyPaisa and JazzCash withdrawals undergo manual audit reviews from PakRewards administrators to filter bot farms and automated script activities. Processing cycles require up to 24 working hours.
        </p>

        <Card variant="gold" className="p-4 mt-6 text-center select-none">
          <p className="text-xs text-gray-300 font-medium">Have questions regarding our policies?</p>
          <span className="text-[10px] text-[#4F8EF7] underline cursor-pointer block mt-1">support@pakrewards.pk</span>
        </Card>
      </div>
    </div>
  );
}
