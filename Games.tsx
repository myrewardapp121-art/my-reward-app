import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Gamepad2, Compass, Award, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';

export default function AdminGames() {
  const { appSettings } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdate = () => {
    toast('Games configurations updated on internal state!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Games Parameters" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        <div className="p-4 bg-yellow-500/5 border-l-4 border-[#D4AF37] rounded-xl leading-relaxed text-[11px] text-gray-300">
           Configure the limits and odds scales for all consumer check games here.
        </div>

        {/* Spin configuring */}
        <Card className="p-4 border-gray-900 bg-[#12121A]">
          <h3 className="text-xs font-bold uppercase text-gray-300 mb-3 flex items-center gap-1.5 font-sans">
             🎡 Spin Wheel Parameters
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Daily Free Spin Limits:</span>
              <strong className="text-white">{appSettings.spinLimit} plays</strong>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Jackpot Odds (Wedge 500):</span>
              <strong className="text-green-500 font-mono">12.5% Probability</strong>
            </div>
            <Button onClick={handleUpdate} variant="gold" className="h-8.5 text-[9px] uppercase font-bold !rounded-lg text-center font-sans tracking-wide">
              Calibrate Random Odds
            </Button>
          </div>
        </Card>

        {/* Scratch configuring */}
        <Card className="p-4 border-gray-900 bg-[#12121A]">
          <h3 className="text-xs font-bold uppercase text-gray-300 mb-3 flex items-center gap-1.5 font-sans">
             🪙 Golden Scratch Parameters
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Daily Scratch Limits:</span>
              <strong className="text-white">{appSettings.scratchLimit} plays</strong>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Maximum Instant Rewards:</span>
              <strong className="text-[#D4AF37] font-mono">🪙 300 Coins</strong>
            </div>
            <Button onClick={handleUpdate} variant="gold" className="h-8.5 text-[9px] uppercase font-bold !rounded-lg text-center font-sans tracking-wide">
              Update Scrape Seeds
            </Button>
          </div>
        </Card>

        {/* Quiz configuring */}
        <Card className="p-4 border-gray-900 bg-[#12121A]">
          <h3 className="text-xs font-bold uppercase text-gray-300 mb-3 flex items-center gap-1.5 font-sans">
             🕌 Islamic Trivia Parameters
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Active Question Pool:</span>
              <strong className="text-white">5 Questions loaded</strong>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <span>Reward per Answers:</span>
              <strong className="text-green-500 font-mono">Up to 🪙 180 coins</strong>
            </div>
            <Button onClick={handleUpdate} variant="gold" className="h-8.5 text-[9px] uppercase font-bold !rounded-lg text-center font-sans tracking-wide">
              Add Trivia Questions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
