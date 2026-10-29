import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/restaurant';
import { formatTime, playChimeSound } from '../utils/formatters';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play,
  Check,
  Flame,
  Utensils
} from 'lucide-react';

interface KitchenDisplaySystemProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const KitchenDisplaySystem: React.FC<KitchenDisplaySystemProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedItemIds, setCompletedItemIds] = useState<{ [key: string]: boolean }>({});
  const [, setTicker] = useState(0);

  // Update timer every 10 seconds to update elapsed display
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleItemDone = (itemId: string) => {
    setCompletedItemIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    if (soundEnabled) {
      playChimeSound('click');
    }
  };

  const getElapsedTimeMinutes = (createdAt: string) => {
    const elapsedMs = Date.now() - new Date(createdAt).getTime();
    return Math.floor(elapsedMs / 60000);
  };

  const submittedOrders = orders.filter((o) => o.orderStatus === 'submitted');
  const cookingOrders = orders.filter((o) => o.orderStatus === 'cooking');
  const readyOrders = orders.filter((o) => o.orderStatus === 'ready');
  const finishedOrders = orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'completed');

  const renderTicket = (order: Order, stage: 'submitted' | 'cooking' | 'ready') => {
    const elapsedMinutes = getElapsedTimeMinutes(order.createdAt);
    const isUrgent = elapsedMinutes >= 15;

    return (
      <div
        key={order.id}
        className={`bg-white rounded-2xl border-2 transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
          isUrgent ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Ticket Header */}
        <div className={`p-3 text-white flex items-center justify-between ${
          stage === 'submitted'
            ? 'bg-amber-600'
            : stage === 'cooking'
            ? 'bg-blue-600'
            : 'bg-emerald-600'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight">
                {order.tableNumber}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-black/20 font-bold uppercase">
                {order.orderType === 'dine_in' ? 'Dine-In' : 'Take-Away'}
              </span>
            </div>
            <span className="text-[11px] text-white/80 font-mono">
              #{order.orderNumber} · {order.customerName}
            </span>
          </div>

          <div className="text-right">
            <div className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
              isUrgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-black/20 text-white'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{elapsedMinutes}m lalu</span>
            </div>
            <span className="text-[10px] text-white/70 block mt-0.5 font-mono">
              {formatTime(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Ticket Order Items with Chef Checkboxes */}
        <div className="p-3.5 space-y-2 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-72">
          {order.items.map((item, idx) => {
            const itemKey = `${order.id}-${idx}`;
            const isDone = !!completedItemIds[itemKey];

            return (
              <div
                key={itemKey}
                onClick={() => toggleItemDone(itemKey)}
                className={`pt-2 first:pt-0 cursor-pointer flex items-start gap-2.5 transition-opacity ${
                  isDone ? 'opacity-40 line-through' : 'opacity-100'
                }`}
              >
                <div className={`w-4 h-4 rounded-sm border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      <span className="font-mono text-blue-600 mr-1.5">{item.quantity}x</span>
                      {item.menuItem.name}
                    </span>
                  </div>

                  {/* Modifiers List */}
                  <div className="text-[11px] space-y-0.5 mt-0.5">
                    {item.modifiers.spiciness && (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600 mr-2">
                        <Flame className="w-3 h-3" /> {item.modifiers.spiciness}
                      </span>
                    )}
                    {item.modifiers.size && (
                      <span className="text-slate-600 font-medium mr-2">
                        Size: {item.modifiers.size}
                      </span>
                    )}
                    {(item.modifiers.ice || item.modifiers.sweetness) && (
                      <span className="text-blue-600 font-medium block">
                        🧊 {item.modifiers.ice} · {item.modifiers.sweetness}
                      </span>
                    )}
                    {item.modifiers.toppings.length > 0 && (
                      <span className="text-amber-700 block font-medium">
                        + {item.modifiers.toppings.map((t) => t.name).join(', ')}
                      </span>
                    )}
                    {item.modifiers.notes && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded-md text-[10px] font-semibold mt-1">
                        ⚠️ Note: {item.modifiers.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Global Notes */}
        {order.orderNotes && (
          <div className="px-3.5 py-1.5 bg-yellow-50 border-t border-yellow-200 text-[11px] text-yellow-900 font-medium">
            Catatan: {order.orderNotes}
          </div>
        )}

        {/* Ticket Action Button */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          {stage === 'submitted' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'cooking');
                if (soundEnabled) playChimeSound('click');
              }}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mulai Masak di Dapur</span>
            </button>
          )}

          {stage === 'cooking' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'ready');
                if (soundEnabled) playChimeSound('bell');
              }}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai Siap Saji</span>
            </button>
          )}

          {stage === 'ready' && (
            <button
              onClick={() => {
                onUpdateOrderStatus(order.id, 'delivered');
                if (soundEnabled) playChimeSound('success');
              }}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Utensils className="w-4 h-4" />
              <span>Selesai / Antar ke Meja</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* KDS Header Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Kitchen Display System (Layar Monitor Dapur)
            </h2>
            <p className="text-xs text-slate-500">
              Pantau pesanan mandiri pelanggan secara real-time dan update status memasak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Suara Bel Aktif' : 'Suara Muted'}</span>
          </button>
        </div>
      </div>

      {/* 3 Active Stages Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Kolom 1: Pesanan Masuk (Baru) */}
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Pesanan Baru Masuk
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-800 text-xs font-bold font-mono">
              {submittedOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {submittedOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                <ChefHat className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Tidak ada pesanan antre baru</p>
              </div>
            ) : (
              submittedOrders.map((order) => renderTicket(order, 'submitted'))
            )}
          </div>
        </div>

        {/* Kolom 2: Sedang Dimasak */}
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Sedang Dimasak
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-800 text-xs font-bold font-mono">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {cookingOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                <Flame className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Dapur sedang luang</p>
              </div>
            ) : (
              cookingOrders.map((order) => renderTicket(order, 'cooking'))
            )}
          </div>
        </div>

        {/* Kolom 3: Siap Saji */}
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Siap Disajikan
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800 text-xs font-bold font-mono">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Belum ada makanan siap saji</p>
              </div>
            ) : (
              readyOrders.map((order) => renderTicket(order, 'ready'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
