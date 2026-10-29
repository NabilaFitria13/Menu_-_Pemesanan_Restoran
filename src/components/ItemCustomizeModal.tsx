import React, { useState } from 'react';
import { MenuItem, MenuOption, SelectedModifier } from '../types/restaurant';
import { formatRupiah } from '../utils/formatters';
import { X, Plus, Minus, Flame, Sparkles, Check } from 'lucide-react';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, modifiers: SelectedModifier) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpiciness, setSelectedSpiciness] = useState<SelectedModifier['spiciness']>(
    item.allowSpiciness ? 'Level 1 (Sedang)' : undefined
  );
  const [selectedIce, setSelectedIce] = useState<SelectedModifier['ice']>(
    item.allowDrinkOptions ? 'Normal Ice' : undefined
  );
  const [selectedSweetness, setSelectedSweetness] = useState<SelectedModifier['sweetness']>(
    item.allowDrinkOptions ? 'Normal Sugar' : undefined
  );
  const [selectedToppings, setSelectedToppings] = useState<MenuOption[]>([]);
  const [notes, setNotes] = useState('');

  const toggleTopping = (topping: MenuOption) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = item.price + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, quantity, {
      spiciness: selectedSpiciness,
      ice: selectedIce,
      sweetness: selectedSweetness,
      toppings: selectedToppings,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-blue-200 mb-1">
              <span>{item.category.toUpperCase()}</span>
              <span>·</span>
              <span>Waktu Masak ~{item.prepTimeMinutes} Menit</span>
            </div>
            <h2 className="text-xl font-bold leading-tight">{item.name}</h2>
            <p className="text-sm text-slate-200 mt-1 line-clamp-2 leading-relaxed font-light">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-left flex-1 text-slate-700">
          {/* Level Pedas */}
          {item.allowSpiciness && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  Pilih Tingkat Kepedasan
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Wajib Pilih 1</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['Tidak Pedas', 'Level 1 (Sedang)', 'Level 2 (Pedas Mantap)', 'Level 3 (Ekstra Pedas)'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedSpiciness(lvl)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedSpiciness === lvl
                        ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span>{lvl}</span>
                    {selectedSpiciness === lvl && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opsi Minuman: Es & Gula */}
          {item.allowDrinkOptions && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Tingkat Es (Ice Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal Ice', 'Less Ice', 'No Ice'] as const).map((ice) => (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setSelectedIce(ice)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                        selectedIce === ice
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {ice}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Kadar Manis (Sweetness Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal Sugar', 'Less Sugar (50%)', 'No Sugar (0%)'] as const).map((sugar) => (
                    <button
                      key={sugar}
                      type="button"
                      onClick={() => setSelectedSweetness(sugar)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                        selectedSweetness === sugar
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {sugar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Topping Tambahan */}
          {item.availableToppings && item.availableToppings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Topping Tambahan (Opsional)
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Boleh Lebih Dari Satu</span>
              </div>
              <div className="space-y-2">
                {item.availableToppings.map((top) => {
                  const isChecked = selectedToppings.some((t) => t.id === top.id);
                  return (
                    <div
                      key={top.id}
                      onClick={() => toggleTopping(top)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-slate-800">{top.name}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                        +{formatRupiah(top.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Catatan Koki / Dapur */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
              Catatan Khusus ke Dapur (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pakai daun bawang, saus dipisah..."
              maxLength={120}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Footer actions with quantity stepper and add button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-bold text-sm font-mono tabular-nums text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Tambah ke Pesanan</span>
            <span className="font-mono tabular-nums text-blue-100 bg-blue-700/60 px-2 py-0.5 rounded-md">
              {formatRupiah(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
