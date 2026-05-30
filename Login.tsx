import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Phone, User, Gift, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const { login } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    setPhoneNumberError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Pakistani Phone format
    // Valid formats: 03001234567 or +923001234567
    const pakPhoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
    if (!pakPhoneRegex.test(phoneNumber)) {
      setPhoneNumberError('Enter a valid Pakistani phone number (e.g. 03001234567)');
      return;
    }

    if (!fullName.trim()) {
      toast('Please enter your full name to proceed', 'warning');
      return;
    }

    setLoading(true);
    try {
      const success = await login(phoneNumber, fullName, referralCode);
      if (success) {
        toast('Verification OTP Sent to ' + phoneNumber, 'success');
        navigate('/verify', { state: { phoneNumber, fullName, referralCode } });
      } else {
        toast('Authentication failed. Please try again.', 'error');
      }
    } catch (err) {
      toast('Network error during authentication.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8 overflow-y-auto">
      {/* Branding Header */}
      <div className="mt-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-[#D4AF37] to-[#4F8EF7]/50 rounded-2xl shadow-lg mb-4 cursor-pointer"
        >
          <Coins className="w-12 h-12 text-[#12121A] animate-pulse" />
        </motion.div>
        <motion.h2 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold font-serif text-[#D4AF37] tracking-tight"
        >
          PakRewards
        </motion.h2>
        <p className="text-gray-400 text-xs mt-1.5 font-medium max-w-[280px] mx-auto tracking-wide">
          Pakistan\'s Premier High-Paying Mobile PWA Wallet & Rewards Platform
        </p>
      </div>

      {/* Main Login Card form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Card variant="gold" className="p-6">
          <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase mb-5 text-left border-l-2 border-[#D4AF37] pl-2.5">
            Create Wallet / Sign In
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Muhammad Ahmad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              iconBefore={<User className="w-4 h-4 text-gray-500" />}
              required
            />
            
            <Input
              label="Pakistani Phone Number"
              placeholder="e.g. 03001234567"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              iconBefore={<Phone className="w-4 h-4 text-gray-500" />}
              error={phoneNumberError}
              required
            />

            <Input
              label="Referral Code (Optional)"
              placeholder="Enter code (or use ADMIN777)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              iconBefore={<Gift className="w-4 h-4 text-gray-500" />}
            />

            <Button
              type="submit"
              variant="gold"
              loading={loading}
              className="mt-2 w-full font-bold shadow-md h-12"
            >
              Request OTP Pin
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Legal and Quick Links */}
      <div className="text-center text-[10px] text-gray-600 mt-6 max-w-[280px] mx-auto leading-relaxed">
        By registering, you accept our{' '}
        <span onClick={() => navigate('/terms')} className="text-[#4F8EF7] underline cursor-pointer">Terms criteria</span>{' '}
        and verify you are within Pakistan. Protected by Supabase and local hardware encryption.
      </div>
    </div>
  );
}
