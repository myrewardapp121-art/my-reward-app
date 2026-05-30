import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Privacy Policy" showBack={true} onBackClick={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 text-left font-sans">
        <h3 className="text-base font-bold font-serif text-[#4F8EF7]">1. Data Collection</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          We gather minimum account telemetry, specifically: Selected hometown city, active mobile network carriers for load matching, full name, phone number, and ledger payouts histories.
        </p>

        <h3 className="text-base font-bold font-serif text-[#4F8EF7]">2. Secure Ledgering</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          All financial payouts, check indicators, and coin scores are written securely to a protected database (Supabase + localStorage). We never share your physical contacts or location indexes with third parties.
        </p>

        <h3 className="text-base font-bold font-serif text-[#4F8EF7]">3. Device Security</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
           To ensure compliance with PWA requirements, safety hashes are stored locally on your device to automate logging in other sessions without exposing raw security values.
        </p>

        <Card variant="navy" className="p-4 mt-6 text-center select-none">
          <p className="text-xs text-gray-300 font-medium font-sans">Our systems are fully compliant with GDPR and Pakistani cyber ledger rules.</p>
        </Card>
      </div>
    </div>
  );
}
