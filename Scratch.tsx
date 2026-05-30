import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../components/ui/Toast';
import { Sparkles, Coins, Gift, RefreshCcw } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Header from '../../../components/layout/Header';

export default function ScratchGame() {
  const { currentUser, addCoins, appSettings } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [playsLeft, setPlaysLeft] = useState(appSettings.scratchLimit);
  const [scratchedSpots, setScratchedSpots] = useState<number[]>([]);
  const [ticketState, setTicketState] = useState<'idle' | 'scratching' | 'revealed'>('idle');
  const [cardPrize, setCardPrize] = useState<number>(0);

  // Pick standard scratch values
  const spotsList = [
    { id: 0, prize: 50, label: '🪙 50' },
    { id: 1, prize: 100, label: '🪙 100' },
    { id: 2, prize: 25, label: '🪙 25' },
    { id: 3, prize: 300, label: '👑 300' },
    { id: 4, prize: 10, label: '🪙 10' },
    { id: 5, prize: 150, label: '🪙 150' }
  ];

  const handleScratchSpot = async (spotId: number) => {
    if (scratchedSpots.includes(spotId) || ticketState === 'revealed') return;

    if (scratchedSpots.length === 0) {
      if (playsLeft <= 0) {
        toast('You have ran out of daily scratch cards. Come back tomorrow!', 'warning');
        return;
      }
      setTicketState('scratching');
      setPlaysLeft(prev => prev - 1);
      
      // Calculate final card prize based on selected spot
      const spotPrize = spotsList[spotId].prize;
      setCardPrize(spotPrize);
    }

    const nextScratched = [...scratchedSpots, spotId];
    setScratchedSpots(nextScratched);

    // Scratching 3 spots reveals the whole card!
    if (nextScratched.length >= 3) {
      setTicketState('revealed');
      // Automatically scratch the rest
      setScratchedSpots([0, 1, 2, 3, 4, 5]);
      
      toast(`You revealed a prize of 🪙 ${cardPrize} Coins!`, 'success');
      await addCoins(cardPrize, 'Won on Golden Scratch Card', 'game');
    }
  };

  const resetTicket = () => {
    setScratchedSpots([]);
    setTicketState('idle');
    setCardPrize(0);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Golden Scratch Card" showBack={true} onBackClick={() => navigate('/games')} />

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 flex flex-col justify-between items-stretch">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">👉 Rub and Scrape Any 3 Gold Spots to Win Immediate Cash!</p>
          <div className="mt-2 flex justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono px-3 py-1 bg-[#12121A] text-gray-300 rounded-lg border border-gray-900">
               Scratch Plays Left Today: <strong className="text-[#D4AF37] font-serif">{playsLeft}</strong>
            </span>
          </div>
        </div>

        {/* Scratch Ticket Box Container */}
        <Card variant="gold" className="p-4 bg-[#12121A] flex flex-col items-stretch relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#D4AF37]/5 blur-2xl rounded-full" />
          
          {/* Header info */}
          <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4 text-left z-10">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest font-sans">Golden Ticket</h4>
                <p className="text-[9px] text-gray-500 font-sans">Click blocks to scratch and scrape</p>
              </div>
            </div>
            <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-gray-900 font-mono text-[#D4AF37] font-bold">
               SERIES PK-786
            </span>
          </div>

          {/* Grid of scratch spots */}
          <div className="grid grid-cols-3 gap-2.5 z-10">
            {spotsList.map((spot) => {
              const scratched = scratchedSpots.includes(spot.id);
              return (
                <div
                  key={spot.id}
                  onClick={() => handleScratchSpot(spot.id)}
                  className={`
                    h-20 rounded-xl flex items-center justify-center relative cursor-pointer select-none transition-all duration-300 overflow-hidden border
                    ${scratched 
                      ? 'bg-black border-dashed border-gray-800 text-white' 
                      : 'bg-gradient-to-tr from-[#D4AF37] via-[#fbdc79] to-[#be9b2e] border-[#D4AF37]'
                    }
                  `}
                >
                  {scratched ? (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-sm font-extrabold font-serif text-[#D4AF37]">🪙 {cardPrize}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold font-sans">Secured</span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Sparkles className="w-5 h-5 text-black/60 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-[8px] text-black font-extrabold uppercase mt-1 tracking-wider font-sans">SCRATCH</span>
                    </div>
                  )}
                  
                  {/* Subtle scratch texture details */}
                  {!scratched && (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {ticketState === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 pt-3.5 border-t border-gray-900 text-center flex flex-col items-center z-10"
              >
                <div className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                   Scratch Wallet Prize Revealer!
                </div>
                <p className="text-xl font-bold font-serif text-gray-200 mt-1">
                  Claimed +🪙 {cardPrize} Coins!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Play controls */}
        <div className="space-y-4">
          {ticketState === 'revealed' && (
            <Button
              onClick={resetTicket}
              variant="navy"
              iconBefore={<RefreshCcw className="w-4 h-4" />}
              className="w-full font-bold uppercase tracking-wide text-xs"
            >
              Play Another Scratch Card
            </Button>
          )}

          <p className="text-[10px] text-gray-600 text-center uppercase tracking-wider select-none leading-none">
             Daily Scratch cap is matched dynamically • Payouts verified in PKR ledger logs.
          </p>
        </div>
      </div>
    </div>
  );
}
