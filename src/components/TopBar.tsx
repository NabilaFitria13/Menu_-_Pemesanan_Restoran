import React from 'react';
import { UtensilsCrossed, BellRing, MonitorSmartphone, ChefHat, ReceiptText, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeTab: 'kiosk' | 'kds' | 'pos' | 'orders';
  setActiveTab: (tab: 'kiosk' | 'kds' | 'pos' | 'orders') => void;
  tableNumber: string;
  orderType: 'dine_in' | 'take_away';
  pax: number;
  onOpenCallWaiter: () => void;
  pendingOrdersCount: number;
  cookingOrdersCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  tableNumber,
  orderType,
  pax,
  onOpenCallWaiter,
  pendingOrdersCount,
  cookingOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setActiveTab('kiosk')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap block">
              Bistro Nusantara
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('kiosk')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'kiosk'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MonitorSmartphone className="w-4 h-4" />
            <span>Pesan Mandiri</span>
          </button>

          <button
            onClick={() => setActiveTab('kds')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'kds'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Layar Dapur</span>
            {(pendingOrdersCount > 0 || cookingOrdersCount > 0) && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-white text-[10px] font-bold">
                {pendingOrdersCount + cookingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'pos'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Kasir & POS</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Status Pesanan</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg whitespace-nowrap">
            <span className="font-semibold text-slate-900">{tableNumber}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span>{orderType === 'dine_in' ? `Dine-In (${pax} Pax)` : 'Take Away'}</span>
          </div>

          <button
            onClick={onOpenCallWaiter}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Panggil Pelayan ke Meja"
          >
            <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Panggil Pelayan</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kiosk')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'kiosk' ? 'bg-blue-600 text-white font-semibold' : ''}`}
        >
          Menu Kiosk
        </button>
        <button
          onClick={() => setActiveTab('kds')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'kds' ? 'bg-blue-600 text-white font-semibold' : ''}`}
        >
          Dapur {pendingOrdersCount > 0 && `(${pendingOrdersCount})`}
        </button>
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'pos' ? 'bg-blue-600 text-white font-semibold' : ''}`}
        >
          Kasir / POS
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-600 text-white font-semibold' : ''}`}
        >
          Status Pesanan
        </button>
      </div>
    </header>
  );
};
