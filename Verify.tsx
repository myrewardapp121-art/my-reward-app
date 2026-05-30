import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function Verify() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = (location.state as { phoneNumber?: string }) || { phoneNumber: '03001234567' };

  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);

  // Simple OTP countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, val: string) => {
    if (Number.isNaN(Number(val))) return; // restrict to numeric keys
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = () => {
    const finalCode = code.join('');
    if (finalCode.length < 4) {
      toast('Please enter the complete 4-digit security code', 'warning');
      return;
    }

    setLoading(true);
    // Simulating quick verification check
    setTimeout(() => {
      setLoading(false);
      toast('OTP Verified Successfully! Welcome to PakRewards.', 'success');
      navigate('/onboarding/profile');
    }, 1200);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(59);
    toast('Security OTP Resent to ' + phoneNumber, 'info');
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      {/* Header back handler */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/login')}
          className="p-1.5 bg-gray-900 rounded-xl text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-gray-500 uppercase ml-3 tracking-widest">Verification</span>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[340px] mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4F8EF7]/10 text-[#4F8EF7] rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-100 tracking-wide">Enter OTP Pin</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            We sent a 4-digit verification code to
            <strong className="text-gray-200 block text-sm mt-1">{phoneNumber}</strong>
          </p>
        </div>

        <Card variant="default" className="py-6 px-4 text-center">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3.5 mb-6">
            {code.map((num, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={1}
                value={num}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 bg-black border border-gray-800 text-center text-xl font-bold rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all duration-150 text-[#D4AF37]"
              />
            ))}
          </div>

          <Button
            type="button"
            variant="gold"
            loading={loading}
            onClick={verifyOtp}
            className="w-full font-bold uppercase tracking-wider"
          >
            Verify and Continue
          </Button>

          {/* Resend OTP area */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {timer > 0 ? (
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Resend OTP in {timer}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-xs font-semibold text-[#4F8EF7] hover:underline flex items-center gap-1.5"
              >
                📥 Resend OTP Pin
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
