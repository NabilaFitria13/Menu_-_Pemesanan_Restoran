import React, { useState } from 'react';
import { RestaurantTable, OrderType } from '../types/restaurant';
import { X, Check, Users, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface TableSelectModalProps {
  currentTable: string;
  currentType: OrderType;
  currentPax: number;
  tables: RestaurantTable[];
  onClose: () => void;
  onSave: (tableNumber: string, orderType: OrderType, pax: number) => void;
}

export const TableSelectModal: React.FC<TableSelectModalProps> = ({
  currentTable,
  currentType,
  currentPax,
  tables,
  onClose,
  onSave,
}) => {
  const [selectedTable, setSelectedTable] = useState(currentTable);
  const [selectedType, setSelectedType] = useState<OrderType>(currentType);
  const [pax, setPax] = useState(currentPax);

  const handleSave = () => {
    onSave(selectedTable, selectedType, pax);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Pilih Meja & Tipe Pemesanan</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-left space-y-5">
          {/* Dine-In vs Take-Away */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Jenis Layanan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType('dine_in')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedType === 'dine_in'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-xs">Makan di Tempat (Dine-In)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('take_away')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedType === 'take_away'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs">Bawa Pulang (Take Away)</span>
              </button>
            </div>
          </div>

          {/* Pax Counter */}
          {selectedType === 'dine_in' && (
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Jumlah Tamu (Pax)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPax(num)}
                    className={`w-10 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      pax === num
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Table Selector */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Nomor Meja
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {tables.map((tbl) => (
                <button
                  key={tbl.id}
                  type="button"
                  onClick={() => setSelectedTable(tbl.name)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedTable === tbl.name
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold">{tbl.name}</span>
                  <span className="text-[10px] text-slate-400">{tbl.capacity} Kursi</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Terapkan Pengaturan Meja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
