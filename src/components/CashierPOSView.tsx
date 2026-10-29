import React, { useState } from 'react';
import { Order, RestaurantTable } from '../types/restaurant';
import { formatRupiah, formatTime } from '../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Users,
  Printer,
  Search,
  Filter,
  CheckCircle,
  Clock,
  LayoutGrid
} from 'lucide-react';

interface CashierPOSViewProps {
  orders: Order[];
  tables: RestaurantTable[];
  onViewReceipt: (order: Order) => void;
  onSelectTableForOrder: (tableId: string) => void;
}

export const CashierPOSView: React.FC<CashierPOSViewProps> = ({
  orders,
  tables,
  onViewReceipt,
  onSelectTableForOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCompleted = orders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'completed').length;
  const averageTicket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Omset Penjualan</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {formatRupiah(totalRevenue)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Hari Ini · Real-time</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Transaksi</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {orders.length}
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1">{totalCompleted} pesanan tersaji</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Rata-rata per Bon</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {formatRupiah(averageTicket)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Average Order Value</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Okupansi Meja</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {tables.filter((t) => t.status === 'occupied').length} / {tables.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Meja Aktif Terisi</span>
        </div>
      </div>

      {/* Restaurant Table Floor Plan Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Denah Status Meja Restoran
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Kosong</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Terisi (Makan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Reservasi</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {tables.map((table) => {
            const hasOccupied = table.status === 'occupied';
            const isReserved = table.status === 'reserved';

            return (
              <div
                key={table.id}
                onClick={() => onSelectTableForOrder(table.name)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-102 ${
                  hasOccupied
                    ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                    : isReserved
                    ? 'border-amber-400 bg-amber-50/50 text-amber-900'
                    : 'border-slate-200 hover:border-emerald-400 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{table.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{table.capacity}p</span>
                </div>
                <div className="text-[11px] font-medium">
                  {hasOccupied ? (
                    <span className="text-blue-700 font-bold">Terisi</span>
                  ) : isReserved ? (
                    <span className="text-amber-700 font-bold">Reservasi</span>
                  ) : (
                    <span className="text-emerald-700">Tersedia</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History & Receipt Center */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Transaksi Penjualan
            </h3>
            <p className="text-xs text-slate-500">
              Daftar seluruh pesanan mandiri pelanggan & cetak ulang struk kasir.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari order / meja..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Status</option>
              <option value="submitted">Baru Masuk</option>
              <option value="cooking">Dimasak</option>
              <option value="ready">Siap Saji</option>
              <option value="delivered">Tersaji</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Order</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Meja & Tamu</th>
                <th className="py-3 px-4">Menu Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    Belum ada riwayat pesanan yang cocok.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {formatTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{order.tableNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{order.customerName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} item
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                        {order.items.map((i) => i.menuItem.name).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold font-mono text-slate-900 tabular-nums">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        order.orderStatus === 'submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : order.orderStatus === 'cooking'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {order.orderStatus === 'submitted' && 'Menunggu'}
                        {order.orderStatus === 'cooking' && 'Dimasak'}
                        {order.orderStatus === 'ready' && 'Siap Saji'}
                        {(order.orderStatus === 'delivered' || order.orderStatus === 'completed') && 'Tersaji'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewReceipt(order)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 bg-white text-slate-600 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium"
                        title="Lihat & Cetak Struk"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
