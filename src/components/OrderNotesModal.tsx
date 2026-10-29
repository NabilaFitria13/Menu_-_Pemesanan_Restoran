import React, { useState } from 'react';
import { X, MessageSquare, Check } from 'lucide-react';

interface OrderNotesModalProps {
  initialNotes?: string;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export const OrderNotesModal: React.FC<OrderNotesModalProps> = ({
  initialNotes = '',
  onClose,
  onSave,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    onSave(notes.trim());
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
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold">Catatan Khusus Pesanan</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-left space-y-4">
          <p className="text-xs text-slate-600">
            Tuliskan instruksi umum untuk kasir dan dapur, misalnya: "Keluarkan minuman duluan", "Alergi kacang", atau "Minta sambal dipisah".
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={250}
            placeholder="Ketik catatan Anda di sini..."
            className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800 leading-relaxed"
          />

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Catatan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
