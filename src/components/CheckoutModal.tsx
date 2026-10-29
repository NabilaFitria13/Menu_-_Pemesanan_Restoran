import React, { useState } from 'react';
import { CartItem, OrderType, PaymentMethod, Order } from '../types/restaurant';
import { formatRupiah, generateOrderNumber, playChimeSound } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  QrCode,
  Banknote,
  CreditCard,
  Ticket,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  cartItems: CartItem[];
  tableNumber: string;
  orderType: OrderType;
  pax: number;
  customerName: string;
  orderNotes?: string;
  appliedPromo: { code: string; discountAmount: number } | null;
  onClose: () => void;
  onOrderSuccess: (completedOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cartItems,
  tableNumber,
  orderType,
  pax,
  customerName,
  orderNotes,
  appliedPromo,
  onClose,
  onOrderSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [cashGiven, setCashGiven] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.1); // PB1 10%
  const serviceCharge = Math.round(taxableAmount * 0.05); // 5%
  const grandTotal = taxableAmount + tax + serviceCharge;

  // Calculate cash change
  const numericCash = typeof cashGiven === 'number' ? cashGiven : 0;
  const cashChange = Math.max(0, numericCash - grandTotal);
  const isCashInsufficient = selectedMethod === 'cash' && numericCash < grandTotal;

  const handleCompletePayment = (autoApproved = false) => {
    if (selectedMethod === 'cash' && !autoApproved && numericCash < grandTotal) {
      return;
    }

    setIsProcessing(true);
    playChimeSound('bell');

    setTimeout(() => {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899']
        });
      } catch {
        // fallback
      }

      playChimeSound('success');

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        tableNumber,
        orderType,
        pax,
        customerName: customerName || 'Pelanggan Meja',
        items: [...cartItems],
        subtotal,
        tax,
        serviceCharge,
        discount,
        discountCode: appliedPromo?.code,
        total: grandTotal,
        paymentMethod: selectedMethod,
        paymentStatus: 'paid',
        orderStatus: 'submitted',
        createdAt: new Date().toISOString(),
        cashReceived: selectedMethod === 'cash' ? (numericCash || grandTotal) : undefined,
        cashChange: selectedMethod === 'cash' ? cashChange : undefined,
        orderNotes,
      };

      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{tableNumber}</span>
              <span>·</span>
              <span>{orderType === 'dine_in' ? `Dine-In (${pax} Pax)` : 'Take Away'}</span>
            </div>
            <h2 className="text-lg font-bold">Pembayaran Pesanan</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-left flex-1">
          {/* Total Display matching mobile reference */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
              Total Pembayaran
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
              {formatRupiah(grandTotal)}
            </span>
            <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-500">
              <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
              <span>·</span>
              <span>PB1 10% & Layanan 5% Termasuk</span>
            </div>
          </div>

          {/* Payment Method Selector Grid - 4 options matching screenshot: Cash, Voucher, Card, QRIS */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'qris'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'qris' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold">QRIS Mandiri</span>
                  <span className="text-[10px] text-slate-500">Gopay, OVO, BCA, Dana</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('cash')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'cash' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold">Tunai (Cash)</span>
                  <span className="text-[10px] text-slate-500">Bayar di Kasir</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'card' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold">Kartu EDC / Debit</span>
                  <span className="text-[10px] text-slate-500">BCA, Mandiri, BRI, Visa</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('voucher')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedMethod === 'voucher'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-900 ring-2 ring-amber-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === 'voucher' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold">Voucher Resto</span>
                  <span className="text-[10px] text-slate-500">Kupon & Promosi</span>
                </div>
              </button>
            </div>
          </div>

          {/* Detailed Method Section */}
          {selectedMethod === 'qris' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-sm tracking-widest">
                  QRIS
                </span>
                <span className="text-xs font-bold text-slate-800">Standar Pembayaran Nasional</span>
              </div>

              {/* Dynamic Simulated QR Code */}
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="white" />
                  {/* Top-left marker */}
                  <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                  <rect x="14" y="14" width="17" height="17" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                  {/* Top-right marker */}
                  <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                  <rect x="69" y="14" width="17" height="17" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                  {/* Bottom-left marker */}
                  <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                  <rect x="14" y="69" width="17" height="17" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                  {/* Data dots pattern */}
                  <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="45" y="45" width="12" height="12" fill="#2563eb" rx="2" />
                  <rect x="15" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="25" y="48" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="65" width="6" height="6" fill="#0f172a" />
                  <rect x="54" y="72" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="80" y="52" width="6" height="6" fill="#0f172a" />
                  <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="78" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>

              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-800">NMID: ID102030405001 · Bistro Nusantara</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Buka BCA, Mandiri Livin, GoPay, OVO, atau ShopeePay lalu scan QR di atas.</p>
              </div>

              <button
                type="button"
                onClick={() => handleCompletePayment(true)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran QRIS Berhasil</span>
              </button>
            </div>
          )}

          {selectedMethod === 'cash' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Jumlah Uang Tunai Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`Contoh: ${grandTotal}`}
                  className="w-full text-sm font-mono font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-white"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCashGiven(grandTotal)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
                >
                  Uang Pas ({formatRupiah(grandTotal)})
                </button>
                <button
                  type="button"
                  onClick={() => setCashGiven(100000)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
                >
                  Rp 100.000
                </button>
                <button
                  type="button"
                  onClick={() => setCashGiven(150000)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
                >
                  Rp 150.000
                </button>
                <button
                  type="button"
                  onClick={() => setCashGiven(200000)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 font-medium cursor-pointer"
                >
                  Rp 200.000
                </button>
              </div>

              {/* Change / Kembalian Calculation */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Kembalian:</span>
                <span className={`text-base font-extrabold font-mono tabular-nums ${cashChange > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {formatRupiah(cashChange)}
                </span>
              </div>

              {isCashInsufficient && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Uang yang diterima kurang dari total pembayaran.</span>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Silakan gesek atau tap kartu Anda pada mesin EDC kasir yang tersedia di samping meja.
              </p>
              <div className="flex justify-center gap-2 text-[11px] font-bold text-slate-500">
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">BCA Debit</span>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">Mandiri</span>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md">Visa / MC</span>
              </div>
            </div>
          )}

          {selectedMethod === 'voucher' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs text-slate-700">
                Gunakan kode kupon untuk mendapatkan potongan langsung:
              </p>
              <div className="text-xs space-y-1 text-slate-600">
                <p>• <code className="bg-amber-100 text-amber-800 px-1 rounded font-bold">MAKANENAK</code> - Diskon 15%</p>
                <p>• <code className="bg-amber-100 text-amber-800 px-1 rounded font-bold">SELERA10</code> - Diskon 10%</p>
                <p>• <code className="bg-amber-100 text-amber-800 px-1 rounded font-bold">HEMAT20</code> - Potongan Rp 20.000</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            disabled={isProcessing || isCashInsufficient}
            onClick={() => handleCompletePayment(false)}
            className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-300 text-white font-bold rounded-2xl text-sm shadow-md transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed"
          >
            <span>
              {isProcessing ? 'Memproses Transaksi...' : 'Konfirmasi & Selesaikan Pesanan'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-blue-100">
                {formatRupiah(grandTotal)}
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
