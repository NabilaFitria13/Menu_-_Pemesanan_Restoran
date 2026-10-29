import React, { useState } from 'react';
import { AVAILABLE_PROMOS } from '../data/mockMenu';
import { formatRupiah } from '../utils/formatters';
import { X, Percent, Check, Tag } from 'lucide-react';

interface PromoModalProps {
  currentPromo: { code: string; discountAmount: number } | null;
  subtotal: number;
  onClose: () => void;
  onApplyPromo: (promo: { code: string; discountAmount: number } | null) => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({
  currentPromo,
  subtotal,
  onClose,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyCustom = (code: string) => {
    const upper = code.trim().toUpperCase();
    const found = AVAILABLE_PROMOS[upper];

    if (!found) {
      setErrorMsg('Kode voucher tidak ditemukan atau telah kedaluwarsa.');
      return;
    }

    if (subtotal < found.minSubtotal) {
      setErrorMsg(`Minimal pembelanjaan untuk kode ini adalah ${formatRupiah(found.minSubtotal)}.`);
      return;
    }

    let discountAmount = 0;
    if (found.discountPercent) {
      discountAmount = Math.round((subtotal * found.discountPercent) / 100);
      if (found.discountPercent === 15 && discountAmount > 25000) {
        discountAmount = 25000;
      }
    } else if (found.discountAmount) {
      discountAmount = found.discountAmount;
    }

    onApplyPromo({ code: upper, discountAmount });
    onClose();
  };

  const handleRemove = () => {
    onApplyPromo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Voucher & Diskon Promo</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-left space-y-4">
          {/* Promo Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Masukkan kode voucher (e.g. MAKANENAK)"
              className="flex-1 uppercase font-mono font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => handleApplyCustom(promoInput)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Gunakan
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          {currentPromo && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900">
                  Kode Aktif: {currentPromo.code}
                </span>
                <span className="text-[11px] text-emerald-700 block font-mono">
                  Potongan: -{formatRupiah(currentPromo.discountAmount)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          )}

          {/* List of Available Promos */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Voucher Tersedia Hari Ini
            </label>
            <div className="space-y-2">
              {Object.entries(AVAILABLE_PROMOS).map(([code, p]) => (
                <div
                  key={code}
                  onClick={() => handleApplyCustom(code)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 block">{code}</span>
                      <span className="text-[11px] text-slate-500">{p.desc}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Pilih</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
