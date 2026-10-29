import React from 'react';
import { Order } from '../types/restaurant';
import { formatRupiah, formatTime } from '../utils/formatters';
import { Printer, X, CheckCircle2, QrCode, Share2 } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-emerald-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold">Pesanan Berhasil Dikirim!</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-700/60 text-white hover:bg-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100/60 flex items-center justify-center">
          {/* Printable Receipt Paper */}
          <div
            id="printable-receipt"
            className="bg-white border border-slate-200 shadow-md p-6 rounded-lg w-full max-w-sm text-slate-800 font-mono text-xs leading-relaxed"
          >
            {/* Header Restoran */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h1 className="text-base font-extrabold uppercase tracking-wider text-slate-900">
                BISTRO NUSANTARA
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Jl. Kuliner Rasa No. 88, Jakarta Selatan
              </p>
              <p className="text-[10px] text-slate-400">Telp: (021) 555-0899 · WiFi: BistroGuest (Pass: rasaenak)</p>
            </div>

            {/* Info Transaksi */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-slate-900">
                <span>NO: {order.orderNumber}</span>
                <span>{order.tableNumber}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tgl: {new Date(order.createdAt).toLocaleDateString('id-ID')} {formatTime(order.createdAt)}</span>
                <span>{order.orderType === 'dine_in' ? `Dine-In (${order.pax}p)` : 'Take-Away'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pelanggan: {order.customerName}</span>
                <span>Self-Order Kiosk</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-900">{item.menuItem.name}</span>
                    <span className="font-bold tabular-nums">{formatRupiah(item.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>
                      {item.quantity}x @{formatRupiah(item.unitPriceWithModifiers)}
                    </span>
                    {item.modifiers.spiciness && (
                      <span className="text-rose-600">[{item.modifiers.spiciness}]</span>
                    )}
                  </div>
                  {item.modifiers.toppings.length > 0 && (
                    <div className="text-[10px] text-slate-400 pl-2">
                      + {item.modifiers.toppings.map((t) => t.name).join(', ')}
                    </div>
                  )}
                  {item.modifiers.notes && (
                    <div className="text-[10px] italic text-slate-400 pl-2">
                      *Note: {item.modifiers.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Perhitungan */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums">{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Promo:</span>
                  <span className="tabular-nums">-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Pajak Resto (PB1 10%):</span>
                <span className="tabular-nums">{formatRupiah(order.tax)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Layanan Resto (5%):</span>
                <span className="tabular-nums">{formatRupiah(order.serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span className="tabular-nums">{formatRupiah(order.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Metode Pembayaran:</span>
                <span className="uppercase font-bold">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'cash' && order.cashReceived && (
                <>
                  <div className="flex justify-between text-slate-500">
                    <span>Tunai Diterima:</span>
                    <span className="tabular-nums">{formatRupiah(order.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Kembalian:</span>
                    <span className="tabular-nums">{formatRupiah(order.cashChange || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Struk */}
            <div className="text-center pt-3 space-y-2">
              <p className="text-[11px] font-bold text-slate-800">
                Terima Kasih Atas Kunjungan Anda!
              </p>
              <p className="text-[10px] text-slate-400">
                Pesanan sedang diteruskan ke Layar Dapur untuk segera dimasak. Mohon tunggu dengan nyaman di meja Anda.
              </p>
              <div className="pt-2 flex justify-center">
                <div className="p-2 border border-slate-300 rounded-sm bg-white">
                  <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                  <span className="text-[8px] text-slate-400 block mt-0.5">SCAN UNTUK E-RECEIPT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Fisik</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNewOrder();
            }}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Pesan Menu Lain</span>
          </button>
        </div>
      </div>
    </div>
  );
};
