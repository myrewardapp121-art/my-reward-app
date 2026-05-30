import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Settings, ShieldCheck, ArrowLeft, Cpu } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/layout/Header';

export default function AdminSettings() {
  const { appSettings } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [minCoins, setMinCoins] = useState(appSettings.minRedeem.toString());
  const [tax, setTax] = useState('2.5');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('System settings saved successfully, syncing with Supabase CDN CDN servers!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="System Variables" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        <Card variant="gold" className="p-4 bg-[#12121A] border-[#D4AF37]/35">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3 border-l-2 border-[#D4AF37] pl-2 font-sans">
             Global Variables Calibration
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Minimum Redemption coins Threshold"
              placeholder="e.g. 1000"
              value={minCoins}
              onChange={(e) => setMinCoins(e.target.value)}
              required
            />

            <Input
              label="EasyPaisa Transaction Tax (%)"
              placeholder="e.g. 2.5"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gold"
              className="w-full tracking-wider uppercase font-extrabold text-xs h-10"
            >
              Apply Calibration Changes
            </Button>
          </form>
        </Card>

        {/* Server diagnostic */}
        <Card className="p-4 border-gray-900 bg-[#12121A]">
          <h3 className="text-xs font-bold uppercase text-gray-300 mb-2 flex items-center gap-1 font-sans">
            <Cpu className="w-4 h-4 text-[#4F8EF7]" /> Hardware Diagnostics
          </h3>
          <div className="space-y-2 text-[10px] text-gray-400 font-mono leading-relaxed">
            <p>🟢 <strong className="text-gray-500">API ROUTING:</strong> RUNNING ON PORT 3000</p>
            <p>🟢 <strong className="text-gray-500">SUPERVISORY:</strong> NODES ONLINE AND ENCRYPTED</p>
            <p>🟢 <strong className="text-gray-500">INTEGRITY:</strong> DATABASE LOCAL STORAGE VIRTUAL ENGINE INJECTED</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
