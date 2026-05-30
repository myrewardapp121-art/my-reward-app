import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const ok = adminLogin(password);
      setLoading(false);
      
      if (ok) {
        toast('Access Granted! Welcome to the Admin Control Panel.', 'success');
        navigate('/admin/dashboard');
      } else {
        toast('Access Denied. Incorrect administrator password.', 'error');
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto bg-[#0A0A0F]">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="p-1.5 bg-gray-900 rounded-xl text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-gray-500 uppercase ml-3 tracking-widest">Admin Authorization</span>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[340px] mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-100 tracking-wide">Admin Sign In</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Enter the authorized admin password to review ledger redemptions, adjust reward odds, and manage users.
          </p>
        </div>

        <Card variant="default" className="py-6 px-4 text-center border-red-500/20 bg-gradient-to-b from-[#12121A] to-[#12121A]">
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <Input
              label="Enter Security Password"
              placeholder="e.g. pakistan786 or admin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconBefore={<Lock className="w-4 h-4 text-gray-500" />}
              required
            />

            <Button
              type="submit"
              variant="danger"
              loading={loading}
              className="w-full font-bold uppercase tracking-wider"
            >
              Verify & Unlock Panel
            </Button>
          </form>

          <p className="text-[10px] text-gray-600 mt-5 leading-tight select-none">
             Bypasses and logging attempts are encrypted inside our Supabase security logs.
          </p>
        </Card>
      </div>
    </div>
  );
}
