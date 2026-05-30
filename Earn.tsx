import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Play, Send, Youtube, Radio, CheckCircle, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';

export default function Earn() {
  const { ads, watchAd, addCoins } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [taskLoadingId, setTaskLoadingId] = useState<string | null>(null);
  const [adLoadingId, setAdLoadingId] = useState<string | null>(null);

  const handleSocialTask = (taskId: string, title: string, reward: number, url: string) => {
    if (completedTasks.includes(taskId)) return;

    setTaskLoadingId(taskId);
    toast(`Redirecting to task media... completes in 4s`, 'info');
    
    // Open external URL in a blank window/tab to actually handle flow
    window.open(url, '_blank', 'noreferrer,noopener');

    setTimeout(async () => {
      // Reward user with coins on successful simulation completion
      const ok = await addCoins(reward, `Completed Social Task: ${title}`);
      if (ok) {
        setCompletedTasks(prev => [...prev, taskId]);
        toast(`Task Complete! +🪙 ${reward} Coins deposited in your wallet.`, 'success');
      }
      setTaskLoadingId(null);
    }, 4000);
  };

  const handleWatchAd = (adId: string, title: string, reward: number) => {
    setAdLoadingId(adId);
    toast('Opening Premium Video Ads Hub...', 'info');

    setTimeout(async () => {
      const ok = await watchAd(adId);
      if (ok) {
        toast(`Ad watched! +🪙 ${reward} Coins added to balance.`, 'success');
      }
      setAdLoadingId(null);
    }, 3000);
  };

  const socialTasks = [
    { id: 't-tg', title: 'Join Official Telegram Channel', reward: 150, platform: 'telegram', icon: <Send className="w-5 h-5 text-sky-400" />, desc: 'Join for daily coupon codes and instant payout logs.', url: 'https://t.me/pakreward_pwa' },
    { id: 't-yt', title: 'Subscribe YouTube Channel', reward: 150, platform: 'youtube', icon: <Youtube className="w-5 h-5 text-red-500" />, desc: 'Watch video secrets to unlock special promotional events.', url: 'https://youtube.com' },
    { id: 't-tk', title: 'Follow Official TikTok Channel', reward: 100, platform: 'tiktok', icon: <Radio className="w-5 h-5 text-fuchsia-400" />, desc: 'Stay updated with live game events and user success blogs.', url: 'https://tiktok.com' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Earning Center" />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Special Info banner */}
        <div className="p-4 bg-gradient-to-r from-[#1A1A2E] to-[#12121A] border-l-4 border-[#4F8EF7] rounded-xl text-left">
          <p className="text-xs text-gray-200 leading-relaxed font-sans">
             Completing these easy-to-do social tasks helps our community expand. More brands buy ad spots, enabling us to give <strong>higher payouts</strong>!
          </p>
        </div>

        {/* Video Ads Section */}
        <div className="text-left">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-3 pl-2.5 border-l-2 border-[#D4AF37] font-serif">High-Yield Video Hub</h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            {ads.map((ad) => (
              <Card key={ad.id} className="p-4 hover:border-[#D4AF37]/35 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-100 flex items-center gap-1.5">
                      <span>📺</span> {ad.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Views today: <strong className="text-gray-200">{ad.viewsToday}</strong> / {ad.viewsLimit} caps
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-md font-mono font-semibold">
                         🪙 +{ad.rewardCoins} Coins
                      </span>
                      <span className="text-[10px] text-gray-500 font-sans">⏱️ {ad.durationSeconds}s duration</span>
                    </div>
                  </div>

                  <Button
                    loading={adLoadingId === ad.id}
                    disabled={ad.viewsToday >= ad.viewsLimit}
                    onClick={() => handleWatchAd(ad.id, ad.title, ad.rewardCoins)}
                    variant="navy"
                    className="w-auto h-9 px-3 rounded-lg text-xs tracking-wider"
                  >
                    Watch Ad
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Social tasks section */}
        <div className="text-left pb-4">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-3 pl-2.5 border-l-2 border-[#4F8EF7] font-serif">Social Platform Tasks</h3>
          
          <div className="space-y-2.5">
            {socialTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div 
                  key={task.id}
                  className="p-4 bg-[#12121A] border border-gray-900 rounded-2xl flex items-start justify-between shadow"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-950/80 flex items-center justify-center border border-gray-800/80 mt-0.5">
                      {task.icon}
                    </div>
                    <div className="text-left max-w-[190px]">
                      <h4 className="text-xs font-bold text-gray-100 leading-tight">{task.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">{task.desc}</p>
                      <span className="inline-flex mt-2 text-[10px] font-bold text-[#4F8EF7] bg-[#4F8EF7]/10 px-2.5 py-0.5 rounded-md font-mono">
                         🪙 +{task.reward} Coins
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSocialTask(task.id, task.title, task.reward, task.url)}
                    loading={taskLoadingId === task.id}
                    disabled={isCompleted}
                    variant={isCompleted ? "ghost" : "gold"}
                    className="w-auto h-9 px-3 rounded-xl text-xs flex-shrink-0"
                  >
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 text-green-500 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      'Earn'
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
