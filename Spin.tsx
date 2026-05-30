import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../components/ui/Toast';
import { Crown, Sparkles, Coins, HelpCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Header from '../../../components/layout/Header';

const SECTORS = [
  { value: 10, label: '🪙 10', color: 'bg-indigo-900 text-white' },
  { value: 50, label: '🪙 50', color: 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' },
  { value: 100, label: '🪙 100', color: 'bg-[#12121A] text-gray-200' },
  { value: 0, label: '💥 Try Again', color: 'bg-red-950 text-red-400' },
  { value: 200, label: '🪙 200', color: 'bg-[#1A1A2E] text-[#4F8EF7]' },
  { value: 5, label: '🪙 5', color: 'bg-gray-900 text-gray-500' },
  { value: 500, label: '👑 500', color: 'bg-amber-500 text-black font-extrabold' },
  { value: 20, label: '🪙 20', color: 'bg-neutral-800 text-neutral-300' }
];

export default function SpinGame() {
  const { currentUser, addCoins, appSettings } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [playsLeft, setPlaysLeft] = useState(appSettings.spinLimit);
  const [currentWin, setCurrentWin] = useState<number | null>(null);

  const startSpin = () => {
    if (spinning) return;
    if (playsLeft <= 0) {
      toast('You have reached the daily Spin limit. Unlock PRO to play unlimited!', 'warning');
      return;
    }

    setSpinning(true);
    setCurrentWin(null);
    setPlaysLeft((prev) => prev - 1);

    // Pick a random wedge
    const targetWedgeIndex = Math.floor(Math.random() * SECTORS.length);
    const wedgeAngle = 360 / SECTORS.length;
    
    // Rotations: 5 full turns (1800 deg) + wedge offset
    const finalAngle = 1800 + (360 - (targetWedgeIndex * wedgeAngle));
    setRotation((prev) => prev + finalAngle);

    setTimeout(async () => {
      setSpinning(false);
      const wonSector = SECTORS[targetWedgeIndex];
      setCurrentWin(wonSector.value);

      if (wonSector.value > 0) {
        toast(`Congratulations! You won 🪙 ${wonSector.value} coins!`, 'success');
        await addCoins(wonSector.value, 'Won on Dynamic Spin Wheel', 'game');
      } else {
        toast('Ah! Try again next time to secure prizes.', 'info');
      }
    }, 4500); // matching dial CSS spin timing
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Daily Spin Wheel" showBack={true} onBackClick={() => navigate('/games')} />

      {/* Main frame */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 flex flex-col justify-between items-stretch">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">✨ Spin and Strike Instant Coin Jackpots!</p>
          <div className="mt-2 flex justify-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono px-3 py-1 bg-[#12121A] text-gray-300 rounded-lg border border-gray-900">
               Spin Plays Left Today: <strong className="text-[#D4AF37] font-serif">{playsLeft}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Rotating Dial container */}
        <div className="relative flex justify-center my-6">
          {/* Top Marker Arrow */}
          <div className="absolute top-0 z-20 -mt-1 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#D4AF37] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          
          {/* Glow backdrop ring */}
          <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#12121A] to-[#1A1A2E] border-[8px] border-gray-900 flex items-center justify-center relative overflow-hidden transition-transform shadow-2xl shadow-black">
            {/* Sector background wedges */}
            <motion.div
              style={{ transform: `rotate(${rotation}deg)` }}
              className="absolute inset-0 w-full h-full transition-transform duration-[4000ms] cubic-bezier(0.1, 0.8, 0.1, 1)"
            >
              {SECTORS.map((sec, i) => {
                const angle = 360 / SECTORS.length;
                const rotationStyle = `rotate(${i * angle}deg)`;
                return (
                  <div
                    key={i}
                    className="absolute top-0 left-1/2 -ml-0.5 w-1 h-[150px] bg-gray-950 origin-bottom"
                    style={{ transform: rotationStyle }}
                  >
                    <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-[10px] font-bold font-sans tracking-wide leading-none select-none text-gray-300 text-center w-20">
                        {sec.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Inner Center Ring Button Trigger */}
            <div className="absolute z-10 w-18 h-18 rounded-full bg-black border-[4px] border-[#D4AF37] shadow-inner shadow-black/80 flex flex-col items-center justify-center select-none cursor-pointer">
              <Coins className="w-6 h-6 text-[#D4AF37] animate-bounce" style={{ animationDuration: '4s' }} />
            </div>
            
            {/* Alternate wedges selector labels visual list */}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4">
          {currentWin !== null && (
            <Card variant="gold" className="p-4 text-center select-none animate-bounce">
              <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest flex items-center justify-center gap-1">
                 You Secured <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <p className="text-2xl font-serif font-bold text-gray-100 mt-1">
                {currentWin > 0 ? `+🪙 ${currentWin} Coins!` : 'Zero Coins. Try Again!'}
              </p>
            </Card>
          )}

          <Button
            onClick={startSpin}
            loading={spinning}
            variant="gold"
            disabled={playsLeft <= 0}
            className="w-full tracking-wider uppercase font-bold text-sm h-12 shadow-lg shadow-black/45"
          >
            {spinning ? 'Wheel is Spinning...' : 'Tap to Spin Web Wheel'}
          </Button>

          <p className="text-[10px] text-gray-600 text-center uppercase tracking-wider select-none leading-none">
             Costs 0 coins to play • Generates real check balances in PKR.
          </p>
        </div>
      </div>
    </div>
  );
}
