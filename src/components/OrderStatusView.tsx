import React from 'react';
import { Order } from '../types/restaurant';
import { formatRupiah, formatTime } from '../utils/formatters';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  UtensilsCrossed,
  Printer,
  Sparkles,
  ShoppingBag,
  BellRing
} from 'lucide-react';

interface OrderStatusViewProps {
  orders: Order[];
  currentTable: string;
  onViewReceipt: (order: Order) => void;
  onOpenCallWaiter: () => void;
  onStartNewOrder: () => void;
}

export const OrderStatusView: React.FC<OrderStatusViewProps> = ({
  orders,
  currentTable,
  onViewReceipt,
  onOpenCallWaiter,
  onStartNewOrder,
}) => {
  // Filter orders for this table first, or show all recent
  const tableOrders = orders.filter((o) => o.tableNumber === currentTable);
  const displayOrders = tableOrders.length > 0 ? tableOrders : orders;

  const getStatusStep = (status: Order['orderStatus']) => {
    switch (status) {
      case 'submitted': return 1;
      case 'cooking': return 2;
      case 'ready': return 3;
      case 'delivered':
      case 'completed': return 4;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-1">
            <span className="font-bold">{currentTable}</span>
            <span>·</span>
            <span>Monitoring Pesanan Meja</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Pantau Pesanan Anda Secara Langsung
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-md">
            Setiap perubahan status dari koki di dapur dapat dilihat di sini secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCallWaiter}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-amber-300" />
            <span>Panggil Pelayan</span>
          </button>
          <button
            onClick={onStartNewOrder}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambah Pesanan</span>
          </button>
        </div>
      </div>

      {/* Orders Cards List */}
      {displayOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Pesanan yang Aktif</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Silakan pilih menu makanan dan minuman lezat dari katalog kami lalu kirim pesanan ke dapur.
          </p>
          <button
            onClick={onStartNewOrder}
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2"
          >
            Buka Menu Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {displayOrders.map((order) => {
            const step = getStatusStep(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs text-left space-y-5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                      <span>·</span>
                      <span className="font-semibold text-blue-600">{order.tableNumber}</span>
                      <span>·</span>
                      <span>{formatTime(order.createdAt)}</span>
                    </div>
                    <span className="text-xs text-slate-600 font-medium block mt-0.5">
                      Pemesan: {order.customerName} ({order.orderType === 'dine_in' ? 'Dine-In' : 'Take-Away'})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold font-mono text-slate-900 tabular-nums">
                      {formatRupiah(order.total)}
                    </span>
                    <button
                      onClick={() => onViewReceipt(order)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Lihat Struk</span>
                    </button>
                  </div>
                </div>

                {/* Live Visual Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Stepper item 1 */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 1 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] mt-2 font-bold leading-tight ${step >= 1 ? 'text-blue-900' : 'text-slate-400'}`}>
                        Pesanan Masuk
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Diterima sistem</span>
                    </div>

                    {/* Stepper item 2 */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 2 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <ChefHat className={`w-5 h-5 ${step === 2 ? 'animate-bounce' : ''}`} />
                      </div>
                      <span className={`text-[11px] mt-2 font-bold leading-tight ${step >= 2 ? 'text-blue-900' : 'text-slate-400'}`}>
                        Sedang Dimasak
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Oleh koki dapur</span>
                    </div>

                    {/* Stepper item 3 */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] mt-2 font-bold leading-tight ${step >= 3 ? 'text-emerald-900' : 'text-slate-400'}`}>
                        Siap Disajikan
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Di counter saji</span>
                    </div>

                    {/* Stepper item 4 */}
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        step >= 4 ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] mt-2 font-bold leading-tight ${step >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>
                        Selesai Diantar
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Selamat menikmati</span>
                    </div>
                  </div>
                </div>

                {/* Items Summary in this Order */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Daftar Hidangan yang Dipesan ({order.items.reduce((s, i) => s + i.quantity, 0)} Porsi):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-800">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          {item.modifiers.spiciness && (
                            <span className="text-[10px] text-rose-600 block">
                              🌶️ {item.modifiers.spiciness}
                            </span>
                          )}
                          {item.modifiers.notes && (
                            <span className="text-[10px] italic text-slate-400 block">
                              "{item.modifiers.notes}"
                            </span>
                          )}
                        </div>
                        <span className="font-mono tabular-nums text-slate-700 font-semibold">
                          {formatRupiah(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
