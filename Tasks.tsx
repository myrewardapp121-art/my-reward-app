import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { FileText, Send, Youtube, Radio, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/layout/Header';

export default function AdminTasks() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpdate = () => {
    toast('Social Loyalties synchronized with backend CDN servers!', 'success');
  };

  const currentTasks = [
    { title: 'Join Official Telegram Channel', reward: 150, desc: '@pakreward_pwa link bindings' },
    { title: 'Subscribe YouTube Channel', reward: 150, desc: 'Redirects to promotional video sequences' },
    { title: 'Follow TikTok Handle', reward: 100, desc: 'Live event alerts logs' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Social Tasks" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        <div className="p-4 bg-[#1A1A2E] border border-[#4F8EF7]/20 rounded-xl leading-relaxed text-[11px] text-gray-400">
           Manage the platform tasks required from players prior to withdrawal review.
        </div>

        <div className="space-y-3">
          {currentTasks.map((t, index) => (
            <Card key={index} className="p-3 bg-[#12121A] border-gray-900 flex justify-between items-center text-xs">
              <div className="text-left">
                <h4 className="font-bold text-gray-200">{t.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                <span className="text-[9px] text-[#4F8EF7] font-mono block mt-1">🪙 +{t.reward} Reward Coins</span>
              </div>
              <button 
                onClick={handleUpdate} 
                className="p-1 px-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 rounded-lg text-[9px] font-bold"
              >
                Change Link
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
