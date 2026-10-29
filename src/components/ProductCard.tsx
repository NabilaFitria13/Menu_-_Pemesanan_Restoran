import React, { useState } from 'react';
import { MenuItem } from '../types/restaurant';
import { formatRupiah } from '../utils/formatters';
import { Plus, Flame, Clock, Sparkles } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onSelect,
  onQuickAdd,
  cartQuantity,
}) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'makanan': return 'Makanan Utama';
      case 'snack': return 'Cemilan Gurih';
      case 'minuman': return 'Minuman Segar';
      case 'kopi': return 'Kopi & Latte';
      case 'dessert': return 'Pencuci Mulut';
      case 'paket': return 'Paket Hemat';
      default: return cat;
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between text-left cursor-pointer"
    >
      {/* Visual Asset Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
            <span className="text-3xl mb-1">🍽️</span>
            <span className="text-xs font-semibold">{item.name}</span>
          </div>
        )}

        {/* Quiet Indicators */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {item.isPopular && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Favorit
            </span>
          )}
          {item.isChefRecommendation && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-md shadow-xs">
              Rekomendasi
            </span>
          )}
        </div>

        {/* Preparation time badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-300" />
          <span>{item.prepTimeMinutes}m</span>
        </div>

        {/* Existing cart badge */}
        {cartQuantity > 0 && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-md animate-scale-in">
            {cartQuantity}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
            <span className="font-medium text-blue-600">{getCategoryLabel(item.category)}</span>
            {item.allowSpiciness && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center text-rose-500 font-medium">
                  <Flame className="w-3 h-3 mr-0.5" /> Pilihan Pedas
                </span>
              </>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {item.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            {item.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
                {formatRupiah(item.originalPrice)}
              </span>
            )}
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums tracking-tight">
              {formatRupiah(item.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // If has modifiers, trigger detail modal; otherwise quick add
                if (item.allowSpiciness || item.allowDrinkOptions || (item.availableToppings && item.availableToppings.length > 0)) {
                  onSelect(item);
                } else {
                  onQuickAdd(item);
                }
              }}
              className="p-1.5 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 active:scale-95 rounded-lg border border-blue-200 hover:border-blue-600 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold px-2.5"
              aria-label={`Tambah ${item.name}`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Pesan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
