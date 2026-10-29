import React, { useState } from 'react';
import { BellRing, X, Check, Utensils, GlassWater, Flame, Receipt, UserCheck } from 'lucide-react';
import { playChimeSound } from '../utils/formatters';

interface CallWaiterModalProps {
  tableNumber: string;
  onClose: () => void;
}

export const CallWaiterModal: React.FC<CallWaiterModalProps> = ({
  tableNumber,
  onClose,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isCalled, setIsCalled] = useState(false);

  const REQUEST_OPTIONS = [
    { id: 'waiter', label: 'Panggil Pelayan ke Meja', icon: UserCheck, desc: 'Bantuan umum atau pertanyaan menu' },
    { id: 'cutlery', label: 'Minta Sendok, Garpu & Piring', icon: Utensils, desc: 'Peralatan makan tambahan' },
    { id: 'water', label: 'Refill Air Putih / Es Batu', icon: GlassWater, desc: 'Isi ulang gelas minum' },
    { id: 'condiment', label: 'Minta Sambal & Saus Tambahan', icon: Flame, desc: 'Sambal terasi, kecap, atau saus tomat' },
    { id: 'bill', label: 'Minta Cetak Tagihan / Bill', icon: Receipt, desc: 'Konfirmasi pembayaran di kasir' },
  ];

  const handleCall = () => {
    setIsCalled(true);
    playChimeSound('bell');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-amber-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            <h2 className="text-base font-bold">Panggil Pelayan ({tableNumber})</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-600/70 text-white hover:bg-amber-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-left space-y-4">
          {isCalled ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Pelayan Sedang Menuju ke Meja Anda!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Permintaan untuk <span className="font-semibold text-slate-800">{tableNumber}</span> telah diterima staf resto kami. Mohon tunggu sejenak.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-600">
                Pilih kebutuhan Anda di bawah ini, pelayan kami akan segera datang melayani:
              </p>

              <div className="space-y-2">
                {REQUEST_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRequest === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedRequest(opt.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold">{opt.label}</span>
                          <span className="text-[11px] text-slate-400">{opt.desc}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCall}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Kirim Panggilan ke Staf</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
