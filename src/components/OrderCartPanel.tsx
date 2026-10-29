import React, { useState } from 'react';
import { CartItem, RestaurantTable, OrderType } from '../types/restaurant';
import { formatRupiah } from '../utils/formatters';
import {
  Printer,
  Percent,
  Receipt,
  MessageSquare,
  User,
  Utensils,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  XCircle,
  Tag
} from 'lucide-react';

interface OrderCartPanelProps {
  cartItems: CartItem[];
  tableNumber: string;
  orderType: OrderType;
  pax: number;
  customerName: string;
  appliedPromo: { code: string; discountAmount: number } | null;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOpenTableSelect: () => void;
  onOpenPromoModal: () => void;
  onOpenNotesModal: () => void;
  onOpenPreviewCheck: () => void;
  onCheckout: () => void;
}

export const OrderCartPanel: React.FC<OrderCartPanelProps> = ({
  cartItems,
  tableNumber,
  orderType,
  pax,
  customerName,
  appliedPromo,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenTableSelect,
  onOpenPromoModal,
  onOpenNotesModal,
  onOpenPreviewCheck,
  onCheckout,
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.1); // PB1 10%
  const serviceCharge = Math.round(taxableAmount * 0.05); // Service 5%
  const grandTotal = taxableAmount + tax + serviceCharge;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Header matching reference image: DINE-IN (1 Pax) + Plus button */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                {orderType === 'dine_in' ? `DINE-IN (${pax} PAX)` : 'TAKE AWAY'}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-800">{tableNumber}</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
              Tamu: {customerName || 'Pelanggan Meja'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTableSelect}
          className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-xs"
          title="Ubah Meja / Pax"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Cart Items Table Header */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 grid grid-cols-12 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
        <span className="col-span-6 text-left">Item</span>
        <span className="col-span-3 text-center">Qty</span>
        <span className="col-span-3 text-right">Total</span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 text-slate-400">
              <Utensils className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-700">Keranjang Masih Kosong</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Pilih menu makanan atau minuman dari daftar di sebelah kanan untuk mulai memesan.
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors grid grid-cols-12 items-center gap-1 text-left"
            >
              {/* Item Details */}
              <div className="col-span-6 pr-1">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {item.menuItem.name}
                </p>
                {/* Modifiers List */}
                <div className="text-[10px] text-slate-500 mt-0.5 space-y-0.5">
                  {item.modifiers.spiciness && (
                    <span className="block text-rose-600 font-medium">
                      🌶️ {item.modifiers.spiciness}
                    </span>
                  )}
                  {item.modifiers.size && (
                    <span className="block">{item.modifiers.size}</span>
                  )}
                  {(item.modifiers.ice || item.modifiers.sweetness) && (
                    <span className="block">
                      {item.modifiers.ice} · {item.modifiers.sweetness}
                    </span>
                  )}
                  {item.modifiers.toppings.length > 0 && (
                    <span className="block text-amber-700">
                      + {item.modifiers.toppings.map((t) => t.name).join(', ')}
                    </span>
                  )}
                  {item.modifiers.notes && (
                    <span className="block italic text-slate-400 truncate">
                      "{item.modifiers.notes}"
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="col-span-3 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                  className="w-5 h-5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Kurangi"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold font-mono text-slate-800 tabular-nums">
                  {item.quantity}x
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                  className="w-5 h-5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Tambah"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Item Total Price */}
              <div className="col-span-3 text-right">
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums block">
                  {formatRupiah(item.totalPrice)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono tabular-nums block">
                  @{formatRupiah(item.unitPriceWithModifiers)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick POS action buttons row matching user image: Print Check, Disc. Order, Delivery Cost, Order Notes, Served By, Cancel Order */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-2.5">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-slate-600">
          <button
            onClick={onOpenPreviewCheck}
            disabled={cartItems.length === 0}
            className="flex flex-col items-center gap-1 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Pratinjau Struk Kasir"
          >
            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white group-hover:border-blue-500 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <Printer className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium leading-none text-slate-600">Print Check</span>
          </button>

          <button
            onClick={onOpenPromoModal}
            className="flex flex-col items-center gap-1 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer group"
            title="Voucher Diskon"
          >
            <div className={`w-8 h-8 rounded-full border ${appliedPromo ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-bold' : 'border-slate-300 bg-white group-hover:border-blue-500 group-hover:text-blue-600'} flex items-center justify-center transition-colors`}>
              <Percent className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium leading-none text-slate-600">
              {appliedPromo ? 'Diskon OK' : 'Disc. Order'}
            </span>
          </button>

          <button
            onClick={onOpenNotesModal}
            className="flex flex-col items-center gap-1 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer group"
            title="Catatan Tambahan Pesanan"
          >
            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white group-hover:border-blue-500 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium leading-none text-slate-600">Order Notes</span>
          </button>

          <button
            onClick={onOpenTableSelect}
            className="flex flex-col items-center gap-1 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer group"
            title="Pilih Meja / Pelayan"
          >
            <div className="w-8 h-8 rounded-full border border-slate-300 bg-white group-hover:border-blue-500 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <User className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium leading-none text-slate-600">Served By</span>
          </button>

          <button
            onClick={onClearCart}
            disabled={cartItems.length === 0}
            className="flex flex-col items-center gap-1 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Batalkan / Kosongkan Pesanan"
          >
            <div className="w-8 h-8 rounded-full border border-rose-300 bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-medium leading-none text-rose-600">Cancel Order</span>
          </button>
        </div>

        {/* Pricing Sub-Breakdown */}
        <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} item)</span>
            <span className="font-mono tabular-nums text-slate-700">{formatRupiah(subtotal)}</span>
          </div>
          {appliedPromo && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Diskon ({appliedPromo.code})</span>
              <span className="font-mono tabular-nums">-{formatRupiah(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Pajak Restoran (PB1 10%)</span>
            <span className="font-mono tabular-nums text-slate-700">{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Layanan (5%)</span>
            <span className="font-mono tabular-nums text-slate-700">{formatRupiah(serviceCharge)}</span>
          </div>
        </div>
      </div>

      {/* Big Green Checkout / Send to Kitchen Button like reference image: Rp 141,600 */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={cartItems.length === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-4 px-5 flex items-center justify-between transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
      >
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-100" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-100">
            Kirim ke Dapur
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold font-mono tabular-nums tracking-tight">
            {formatRupiah(grandTotal)}
          </span>
          <ArrowRight className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};
