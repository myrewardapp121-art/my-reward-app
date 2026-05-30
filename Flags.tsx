import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Flag, ShieldCheck, ShieldAlert, ArrowLeft, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Header from '../../components/layout/Header';

export default function AdminFlags() {
  const { flags, adminResolveFlag } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResolve = (id: string) => {
    adminResolveFlag(id, 'resolved');
    toast(`Flag ID ${id} resolved! User restored to normal checks.`, 'success');
  };

  const handleBan = (id: string, name: string) => {
    adminResolveFlag(id, 'banned');
    toast(`User ${name} has been banned and locked out!`, 'error');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Safety Reports" showBack={true} onBackClick={() => navigate('/admin/dashboard')} />

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-10 text-left">
        <div className="p-4 bg-[#EF4444]/5 border-l-4 border-[#EF4444] rounded-xl">
          <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
            These accounts have been flagged by local client sandboxing modules for potential script injection or double click manipulations. Verify values carefully.
          </p>
        </div>

        {/* Flag list loops */}
        <div className="space-y-3">
          {flags.map((report) => {
            const isResolved = report.status === 'resolved';
            const isBanned = report.status === 'banned';

            return (
              <Card 
                key={report.id}
                className={`p-4 bg-[#12121A] border-gray-900
                  ${report.severity === 'high' && !isResolved && !isBanned ? 'border-l-4 border-l-[#EF4444]' : ''}
                `}
              >
                <div className="flex justify-between items-start border-b border-gray-900 pb-2.5 mb-2.5">
                  <div className="text-left w-2/3">
                    <h4 className="text-xs font-bold text-gray-100">{report.fullName}</h4>
                    <span className="text-[9px] text-gray-500 font-mono block mt-0.5">{report.email}</span>
                  </div>

                  <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded font-mono
                    ${report.severity === 'high' ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#F59E0B]/15 text-[#F59E0B]'}
                  `}>
                    {report.severity} risk
                  </span>
                </div>

                {/* Abuse statement */}
                <div className="text-left py-1 text-[11px] text-gray-400 space-y-2 font-mono">
                  <p><strong className="text-gray-500">REASON:</strong> {report.reason}</p>
                  <p><strong className="text-gray-500">FLAG DATE:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                  
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-500 font-bold">STATUS:</strong>
                    {isResolved ? (
                      <span className="text-green-500 font-bold uppercase">✅ Resolved</span>
                    ) : isBanned ? (
                      <span className="text-red-500 font-bold uppercase">🚫 Banned</span>
                    ) : (
                      <span className="text-[#F59E0B] font-bold uppercase">⏳ Pending Audit</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!isResolved && !isBanned && (
                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={() => handleResolve(report.id)}
                      variant="navy"
                      className="h-8 py-0 px-3.5 text-[10px] w-full"
                    >
                      Dismiss & Resolve
                    </Button>
                    
                    <Button
                      onClick={() => handleBan(report.id, report.fullName)}
                      variant="danger"
                      className="h-8 py-0 px-3.5 text-[10px] w-full"
                    >
                      Hard Ban User
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
