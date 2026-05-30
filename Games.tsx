import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Gamepad2, Play, Flame, Star, Coins } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Games() {
  const { appSettings } = useApp();
  const navigate = useNavigate();

  const activeGames = [
    {
      id: 'spin',
      name: 'Dynamic Spin Wheel',
      description: 'Test your luck and spin the wheel of fortune to win up to 500 Coins!',
      limit: appSettings.spinLimit,
      emoji: '🎡',
      route: '/games/spin',
      color: 'border-yellow-500/20 bg-[#D4AF37]/5',
      prizeText: 'UP TO 🪙 500 Coins'
    },
    {
      id: 'scratch',
      name: 'Golden Scratch Card',
      description: 'Scrape off the golden coat with your finger and reveal your hidden instant cash bonus.',
      limit: appSettings.scratchLimit,
      emoji: '🪙',
      route: '/games/scratch',
      color: 'border-blue-500/20 bg-blue-500/5',
      prizeText: 'UP TO 🪙 300 Coins'
    },
    {
      id: 'quiz',
      name: 'Islamic History Trivia Quiz',
      description: 'Put your knowledge to the test! Answer Pakistani and Islamic Trivia questions to earn guaranteed prizes.',
      limit: appSettings.quizLimit,
      emoji: '🕌',
      route: '/games/quiz',
      color: 'border-emerald-500/20 bg-emerald-500/5',
      prizeText: '🪙 150 Coins / Question'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Interactive Games" />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Games promo banner */}
        <div className="p-4 rounded-2xl bg-[#1A1A2E] border border-[#4F8EF7]/20 text-left flex items-center justify-between">
          <div className="max-w-[240px]">
            <h4 className="text-xs font-bold text-gray-100 flex items-center gap-1.5 font-serif">
              Play and Multiply <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            </h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed font-sans">
              No deposit required! Put your daily attention slots to work, earn coins, and withdraw to Easypaisa.
            </p>
          </div>
          <Gamepad2 className="w-10 h-10 text-wallet-blue animate-bounce" />
        </div>

        {/* Games List content */}
        <div className="text-left space-y-3.5 pb-8">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase pl-2 border-l-2 border-[#D4AF37] font-serif">Select Game Mode</h3>

          <div className="space-y-3">
            {activeGames.map((gm) => (
              <Card 
                key={gm.id}
                onClick={() => navigate(gm.route)}
                className={`p-4 hover:border-gray-700/50 cursor-pointer overflow-hidden relative border ${gm.color}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3.5">
                    <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] select-none">
                      {gm.emoji}
                    </span>
                    <div className="text-left mt-0.5 max-w-[210px]">
                      <h4 className="text-sm font-bold text-gray-100 font-serif tracking-wide">{gm.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 lines-clamp-2 leading-relaxed font-sans">
                        {gm.description}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-[#D4AF37] bg-black/60 border border-[#D4AF37]/30 px-2 py-0.5 rounded font-mono">
                          {gm.prizeText}
                        </span>
                        <span className="text-[9px] text-gray-500 font-medium font-sans">
                          Daily cap: {gm.limit} plays
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1 px-2.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg active:scale-95 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    Play <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
