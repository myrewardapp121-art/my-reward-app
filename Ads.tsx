import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Play, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';

export default function AdminAds() {
  const { ads, adminAddAd } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [rewardCoins, setRewardCoins] = useState('');
  const [duration, setDuration] = useState('15');
  const [viewsLimit, setViewsLimit] = useState('50');

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !rewardCoins) {
      toast('Please supply campaign titles and payout rates', 'warning');
      return;
    }

    adminAddAd({
      title,
      rewardCoins: Number(rewardCoins),
      durationSeconds: Number(duration),
      viewsLimit: Number(viewsLimit),
      status: 'active'
    });

    toast(`Campaign "${title}" created! Players can now view the advertisement.`, 'success');

    // Reset Form
    setTitle('');
    setRewardCoins('');
    setDuration('15');
    setViewsLimit('50');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Ad Placements" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        
        {/* Spawn Campaign form */}
        <Card variant="gold" className="p-4 bg-[#12121A] border-[#D4AF37]/35 relative">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3 border-l-2 border-[#D4AF37] pl-2">
             Spawn New Sponsored Ad
          </h3>

          <form onSubmit={handleCreateAd} className="space-y-3.5">
            <Input
              label="Campaign Advert Title"
              placeholder="e.g. Zong 4G High Volume Package Ad"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Reward (Coins)"
                placeholder="e.g. 150"
                type="number"
                value={rewardCoins}
                onChange={(e) => setRewardCoins(e.target.value)}
                required
              />
              <Input
                label="Secs Duration"
                placeholder="e.g. 15"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
              <Input
                label="Views Limit"
                placeholder="e.g. 50"
                type="number"
                value={viewsLimit}
                onChange={(e) => setViewsLimit(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              iconBefore={<Plus className="w-4 h-4 text-black stroke-[3px]" />}
              className="w-full tracking-wider uppercase font-bold text-xs h-10"
            >
              Add Ad Placement
            </Button>
          </form>
        </Card>

        {/* Existing Ads loop */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase pl-2 border-l-2 border-[#4F8EF7] font-serif">Active Live Placements</h3>

          <div className="space-y-2.5">
            {ads.map((ad) => (
              <Card key={ad.id} className="p-3 bg-[#12121A] border-gray-900">
                <div className="flex justify-between items-center">
                  <div className="text-left w-2/3">
                    <h4 className="text-xs font-bold text-gray-200 line-clamp-1 flex items-center gap-1">
                      <span>📺</span> {ad.title}
                    </h4>
                    <span className="text-[9px] text-[#22C55E] font-mono leading-none block mt-1.5 font-semibold">
                      +{ad.rewardCoins} Coins • ⏱️ {ad.durationSeconds}s
                    </span>
                  </div>

                  <span className="text-[9px] bg-black/60 border border-gray-800 text-gray-400 px-2.5 py-0.5 rounded font-mono font-semibold">
                     {ad.viewsToday} / {ad.viewsLimit} cap
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
