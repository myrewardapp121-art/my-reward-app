import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Compass, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AVATARS = [
  { id: 'markhor', emoji: '🐐', name: 'Markhor (National)' },
  { id: 'shaheen', emoji: '🦅', name: 'Shaheen Falcon' },
  { id: 'leopard', emoji: '🐆', name: 'Snow Leopard' },
  { id: 'jasmine', emoji: '🌸', name: 'Jasmine Flower' }
];

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 
  'Quetta', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala'
];

export default function OnboardingProfile() {
  const { currentUser, updateProfile, addCoins } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState('markhor');
  const [city, setCity] = useState('Karachi');
  const [carrier, setCarrier] = useState('Jazz');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const selectedEmoji = AVATARS.find((av) => av.id === avatar)?.emoji || '📱';
      
      await updateProfile({
        avatarUrl: selectedEmoji,
        walletAddress: currentUser?.walletAddress || `0x${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });

      // Show welcome credit celebratory message
      toast('Welcome bonus active! Ready for coins.', 'success');
      
      setTimeout(() => {
        setLoading(false);
        navigate('/home');
      }, 1000);
    } catch (e) {
      toast('Onboarding error, please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
      {/* Header */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold font-serif text-gray-100 tracking-wide flex items-center justify-center gap-2">
          Customise Your Profile <Star className="w-5 h-5 text-[#D4AF37]" />
        </h2>
        <p className="text-xs text-gray-400 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
          Select a profile avatar and configure local variables for high payouts.
        </p>
      </div>

      <div className="space-y-5 my-6">
        {/* Avatar Select */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2.5 uppercase tracking-wider text-left">
            Choose Your Pakistani Character Emblem
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => setAvatar(av.id)}
                type="button"
                className={`
                  relative h-18 rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 outline-none
                  ${avatar === av.id 
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-white scale-105 shadow-md' 
                    : 'border-gray-800 bg-[#12121A] text-gray-400 hover:border-gray-700'
                  }
                `}
              >
                <span className="text-2xl mb-1">{av.emoji}</span>
                <span className="text-[10px] font-sans font-semibold text-center leading-tight truncate px-1 max-w-full">
                  {av.name.split(' ')[0]}
                </span>
                
                {avatar === av.id && (
                  <div className="absolute -top-1 -right-1 bg-[#22C55E] text-white p-0.5 rounded-full border border-black shadow">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Location Dropdown selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider text-left">
             Hailing City (Hometown)
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-12 bg-[#12121A] border border-gray-800 rounded-xl px-4 text-xs font-medium text-gray-200 outline-none focus:border-[#4F8EF7]"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}, Pakistan
              </option>
            ))}
          </select>
        </div>

        {/* Telecommunication network choice */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider text-left">
            Active Mobile Telecom Network Carrier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['Jazz', 'Telenor', 'Zong', 'Ufone'].map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setCarrier(net)}
                className={`
                  h-11 rounded-xl text-xs font-semibold border tracking-wider outline-none transition-all
                  ${carrier === net 
                    ? 'bg-[#1A1A2E] text-[#4F8EF7] border-[#4F8EF7]/50' 
                    : 'bg-[#12121A] text-gray-500 border-gray-800 hover:border-gray-700'
                  }
                `}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleComplete}
        variant="gold"
        loading={loading}
        iconAfter={<Compass className="w-5 h-5 ml-1.5" />}
        className="w-full font-bold uppercase tracking-wider shadow-lg shadow-black/45 h-12.5"
      >
        Enter Rewards Dashboard
      </Button>
    </div>
  );
}
