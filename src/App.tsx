import React, { useState } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  RestaurantTable,
  OrderType,
  OrderStatus,
  SelectedModifier,
} from './types/restaurant';
import { INITIAL_MENU_ITEMS, INITIAL_TABLES } from './data/mockMenu';
import { TopBar } from './components/TopBar';
import { ProductCard } from './components/ProductCard';
import { OrderCartPanel } from './components/OrderCartPanel';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { KitchenDisplaySystem } from './components/KitchenDisplaySystem';
import { CashierPOSView } from './components/CashierPOSView';
import { OrderStatusView } from './components/OrderStatusView';
import { TableSelectModal } from './components/TableSelectModal';
import { PromoModal } from './components/PromoModal';
import { OrderNotesModal } from './components/OrderNotesModal';
import { CallWaiterModal } from './components/CallWaiterModal';
import { formatRupiah, playChimeSound } from './utils/formatters';
import {
  Search,
  SlidersHorizontal,
  Utensils,
  ShoppingBag,
  Sparkles,
  Coffee,
  IceCream,
  PackageOpen,
  ChevronRight,
  Flame,
  X
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'kiosk' | 'kds' | 'pos' | 'orders'>('kiosk');

  // Restaurant Table & Session State
  const [tableNumber, setTableNumber] = useState('Meja 04');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [pax, setPax] = useState(2);
  const [customerName, setCustomerName] = useState('Nabila Fitria');
  const [orderNotes, setOrderNotes] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);

  // Menu Catalog State
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'price-asc' | 'price-desc'>('default');

  // Pre-seeded Cart Items mirroring user's laptop image
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'init-1',
      menuItem: INITIAL_MENU_ITEMS[0], // Chicken Wings
      quantity: 1,
      modifiers: {
        spiciness: 'Level 2 (Pedas Mantap)',
        toppings: [],
      },
      unitPriceWithModifiers: 32000,
      totalPrice: 32000,
    },
    {
      cartItemId: 'init-2',
      menuItem: INITIAL_MENU_ITEMS[1], // Chicken Stick
      quantity: 1,
      modifiers: {
        toppings: [],
      },
      unitPriceWithModifiers: 20000,
      totalPrice: 20000,
    },
    {
      cartItemId: 'init-3',
      menuItem: INITIAL_MENU_ITEMS[2], // Chicken Popcorn
      quantity: 1,
      modifiers: {
        spiciness: 'Level 1 (Sedang)',
        toppings: [],
      },
      unitPriceWithModifiers: 23000,
      totalPrice: 23000,
    },
    {
      cartItemId: 'init-4',
      menuItem: INITIAL_MENU_ITEMS[3], // Dino Nugget
      quantity: 1,
      modifiers: {
        toppings: [],
      },
      unitPriceWithModifiers: 12000,
      totalPrice: 12000,
    },
    {
      cartItemId: 'init-5',
      menuItem: INITIAL_MENU_ITEMS[8], // Choco Frappuccino
      quantity: 1,
      modifiers: {
        size: 'Large (+Rp 6.000)',
        sweetness: 'Normal Sugar',
        ice: 'Normal Ice',
        toppings: [],
        notes: 'Coklat pekat, sedotan kertas',
      },
      unitPriceWithModifiers: 39000,
      totalPrice: 39000,
    },
  ]);

  // Pre-seeded Active Orders for KDS & POS realism
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-seed-1',
      orderNumber: 'ORD-101',
      tableNumber: 'Meja 03',
      orderType: 'dine_in',
      pax: 3,
      customerName: 'Bpk. Hendra',
      items: [
        {
          cartItemId: 's1-1',
          menuItem: INITIAL_MENU_ITEMS[4], // Nasi Goreng Spesial
          quantity: 2,
          modifiers: { spiciness: 'Level 2 (Pedas Mantap)', toppings: [], notes: 'Telur setengah matang' },
          unitPriceWithModifiers: 35000,
          totalPrice: 70000,
        },
        {
          cartItemId: 's1-2',
          menuItem: INITIAL_MENU_ITEMS[7], // Caramel Macchiato
          quantity: 2,
          modifiers: { ice: 'Less Ice', sweetness: 'Normal Sugar', toppings: [] },
          unitPriceWithModifiers: 30000,
          totalPrice: 60000,
        },
      ],
      subtotal: 130000,
      tax: 13000,
      serviceCharge: 6500,
      discount: 0,
      total: 149500,
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      orderStatus: 'cooking',
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
    {
      id: 'ord-seed-2',
      orderNumber: 'ORD-102',
      tableNumber: 'Meja 09',
      orderType: 'dine_in',
      pax: 4,
      customerName: 'Ibu Sarah',
      items: [
        {
          cartItemId: 's2-1',
          menuItem: INITIAL_MENU_ITEMS[0], // Chicken Wings
          quantity: 2,
          modifiers: { spiciness: 'Tidak Pedas', toppings: [] },
          unitPriceWithModifiers: 32000,
          totalPrice: 64000,
        },
        {
          cartItemId: 's2-2',
          menuItem: INITIAL_MENU_ITEMS[6], // Caramel Milkshake
          quantity: 2,
          modifiers: { ice: 'Normal Ice', sweetness: 'Normal Sugar', toppings: [] },
          unitPriceWithModifiers: 26000,
          totalPrice: 52000,
        },
      ],
      subtotal: 116000,
      tax: 11600,
      serviceCharge: 5800,
      discount: 10000,
      discountCode: 'SELERA10',
      total: 123400,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      orderStatus: 'ready',
      createdAt: new Date(Date.now() - 16 * 60000).toISOString(),
    },
  ]);

  // Modals
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isTableSelectModalOpen, setIsTableSelectModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isOrderNotesModalOpen, setIsOrderNotesModalOpen] = useState(false);
  const [isCallWaiterModalOpen, setIsCallWaiterModalOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (item: MenuItem, quantity: number, modifiers: SelectedModifier) => {
    const toppingsTotal = modifiers.toppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = item.price + toppingsTotal;
    const totalPrice = unitPrice * quantity;

    const newCartItem: CartItem = {
      cartItemId: `item-${Date.now()}-${Math.random()}`,
      menuItem: item,
      quantity,
      modifiers,
      unitPriceWithModifiers: unitPrice,
      totalPrice,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    playChimeSound('click');
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, 1, {
      toppings: [],
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPriceWithModifiers * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Kosongkan semua item dalam keranjang pesanan?')) {
      setCartItems([]);
      setAppliedPromo(null);
    }
  };

  // Order Placement
  const handleOrderSuccess = (completedOrder: Order) => {
    setOrders((prev) => [completedOrder, ...prev]);
    setActiveReceiptOrder(completedOrder);
    setIsCheckoutModalOpen(false);
    setIsReceiptModalOpen(true);
    setCartItems([]);
    setAppliedPromo(null);
    setIsMobileCartOpen(false);

    // Update table status to occupied
    setTables((prev) =>
      prev.map((t) =>
        t.name === tableNumber
          ? { ...t, status: 'occupied', activeOrderId: completedOrder.id }
          : t
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  // Filtering & Sorting
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const cartDiscount = appliedPromo ? appliedPromo.discountAmount : 0;
  const cartTax = Math.round(Math.max(0, cartSubtotal - cartDiscount) * 0.1);
  const cartService = Math.round(Math.max(0, cartSubtotal - cartDiscount) * 0.05);
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount) + cartTax + cartService;

  const categories = [
    { id: 'all', label: 'Semua Menu', icon: Utensils },
    { id: 'makanan', label: 'Makanan Utama', icon: Utensils },
    { id: 'snack', label: 'Cemilan & Finger Food', icon: Flame },
    { id: 'minuman', label: 'Minuman Segar', icon: IceCream },
    { id: 'kopi', label: 'Kopi & Latte', icon: Coffee },
    { id: 'dessert', label: 'Pencuci Mulut', icon: Sparkles },
    { id: 'paket', label: 'Paket Hemat', icon: PackageOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tableNumber={tableNumber}
        orderType={orderType}
        pax={pax}
        onOpenCallWaiter={() => setIsCallWaiterModalOpen(true)}
        pendingOrdersCount={orders.filter((o) => o.orderStatus === 'submitted').length}
        cookingOrdersCount={orders.filter((o) => o.orderStatus === 'cooking').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 lg:pb-6">
        {/* TAB 1: KIOSK SELF-ORDER (Mirrors layout from User's uploaded screenshot) */}
        {activeTab === 'kiosk' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: POS Order Cart Panel (Sticky on Desktop) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 h-[calc(100vh-100px)] sticky top-20">
              <OrderCartPanel
                cartItems={cartItems}
                tableNumber={tableNumber}
                orderType={orderType}
                pax={pax}
                customerName={customerName}
                appliedPromo={appliedPromo}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onOpenTableSelect={() => setIsTableSelectModalOpen(true)}
                onOpenPromoModal={() => setIsPromoModalOpen(true)}
                onOpenNotesModal={() => setIsOrderNotesModalOpen(true)}
                onOpenPreviewCheck={() => {
                  if (cartItems.length > 0) {
                    const previewOrder: Order = {
                      id: 'preview',
                      orderNumber: 'PREVIEW',
                      tableNumber,
                      orderType,
                      pax,
                      customerName,
                      items: cartItems,
                      subtotal: cartSubtotal,
                      tax: cartTax,
                      serviceCharge: cartService,
                      discount: cartDiscount,
                      discountCode: appliedPromo?.code,
                      total: cartGrandTotal,
                      paymentMethod: 'qris',
                      paymentStatus: 'pending',
                      orderStatus: 'submitted',
                      createdAt: new Date().toISOString(),
                      orderNotes,
                    };
                    setActiveReceiptOrder(previewOrder);
                    setIsReceiptModalOpen(true);
                  }
                }}
                onCheckout={() => setIsCheckoutModalOpen(true)}
              />
            </div>

            {/* Right Column: Menu Catalog (Search, Categories, Product Cards Grid) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Search and Sort Toolbar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari makanan, minuman, cemilan..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden cursor-pointer"
                  >
                    <option value="default">Urutan Standar</option>
                    <option value="popular">Menu Paling Populer</option>
                    <option value="price-asc">Harga: Rendah ke Tinggi</option>
                    <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? menuItems.length
                      : menuItems.filter((i) => i.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Product Grid */}
              {sortedItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                  <Utensils className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">Menu Tidak Ditemukan</p>
                  <p className="text-xs text-slate-400">
                    Coba ganti kata kunci pencarian atau pilih kategori menu lainnya.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
                  {sortedItems.map((item) => {
                    const cartCount = cartItems
                      .filter((c) => c.menuItem.id === item.id)
                      .reduce((sum, c) => sum + c.quantity, 0);

                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        onSelect={(item) => setSelectedMenuItem(item)}
                        onQuickAdd={handleQuickAdd}
                        cartQuantity={cartCount}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KITCHEN DISPLAY SYSTEM */}
        {activeTab === 'kds' && (
          <KitchenDisplaySystem
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* TAB 3: CASHIER / POS MANAGEMENT */}
        {activeTab === 'pos' && (
          <CashierPOSView
            orders={orders}
            tables={tables}
            onViewReceipt={(order) => {
              setActiveReceiptOrder(order);
              setIsReceiptModalOpen(true);
            }}
            onSelectTableForOrder={(tableName) => {
              setTableNumber(tableName);
              setActiveTab('kiosk');
            }}
          />
        )}

        {/* TAB 4: ORDER STATUS TRACKER FOR DINERS */}
        {activeTab === 'orders' && (
          <OrderStatusView
            orders={orders}
            currentTable={tableNumber}
            onViewReceipt={(order) => {
              setActiveReceiptOrder(order);
              setIsReceiptModalOpen(true);
            }}
            onOpenCallWaiter={() => setIsCallWaiterModalOpen(true)}
            onStartNewOrder={() => setActiveTab('kiosk')}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Floating Cart Bar (< 15% viewport height) */}
      {activeTab === 'kiosk' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 shadow-lg">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="flex items-center gap-3 text-left cursor-pointer flex-1"
            >
              <div className="relative w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {totalCartCount} Item · {tableNumber}
                </span>
                <span className="text-sm font-extrabold font-mono tabular-nums text-slate-900">
                  {formatRupiah(cartGrandTotal)}
                </span>
              </div>
            </button>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <span>Bayar & Kirim</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Cart Slide-Over Modal */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 bg-slate-100 flex items-center justify-between border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Keranjang Pesanan ({tableNumber})
              </span>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[60vh] overflow-hidden">
              <OrderCartPanel
                cartItems={cartItems}
                tableNumber={tableNumber}
                orderType={orderType}
                pax={pax}
                customerName={customerName}
                appliedPromo={appliedPromo}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onOpenTableSelect={() => {
                  setIsMobileCartOpen(false);
                  setIsTableSelectModalOpen(true);
                }}
                onOpenPromoModal={() => {
                  setIsMobileCartOpen(false);
                  setIsPromoModalOpen(true);
                }}
                onOpenNotesModal={() => {
                  setIsMobileCartOpen(false);
                  setIsOrderNotesModalOpen(true);
                }}
                onOpenPreviewCheck={() => {
                  if (cartItems.length > 0) {
                    const previewOrder: Order = {
                      id: 'preview',
                      orderNumber: 'PREVIEW',
                      tableNumber,
                      orderType,
                      pax,
                      customerName,
                      items: cartItems,
                      subtotal: cartSubtotal,
                      tax: cartTax,
                      serviceCharge: cartService,
                      discount: cartDiscount,
                      discountCode: appliedPromo?.code,
                      total: cartGrandTotal,
                      paymentMethod: 'qris',
                      paymentStatus: 'pending',
                      orderStatus: 'submitted',
                      createdAt: new Date().toISOString(),
                    };
                    setActiveReceiptOrder(previewOrder);
                    setIsMobileCartOpen(false);
                    setIsReceiptModalOpen(true);
                  }
                }}
                onCheckout={() => {
                  setIsMobileCartOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ItemCustomizeModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal
          cartItems={cartItems}
          tableNumber={tableNumber}
          orderType={orderType}
          pax={pax}
          customerName={customerName}
          orderNotes={orderNotes}
          appliedPromo={appliedPromo}
          onClose={() => setIsCheckoutModalOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && (
        <ReceiptModal
          order={activeReceiptOrder}
          onClose={() => setIsReceiptModalOpen(false)}
          onNewOrder={() => {
            setActiveTab('kiosk');
          }}
        />
      )}

      {/* Table Selector Modal */}
      {isTableSelectModalOpen && (
        <TableSelectModal
          currentTable={tableNumber}
          currentType={orderType}
          currentPax={pax}
          tables={tables}
          onClose={() => setIsTableSelectModalOpen(false)}
          onSave={(newTable, newType, newPax) => {
            setTableNumber(newTable);
            setOrderType(newType);
            setPax(newPax);
          }}
        />
      )}

      {/* Promo Voucher Modal */}
      {isPromoModalOpen && (
        <PromoModal
          currentPromo={appliedPromo}
          subtotal={cartSubtotal}
          onClose={() => setIsPromoModalOpen(false)}
          onApplyPromo={(promo) => setAppliedPromo(promo)}
        />
      )}

      {/* Order Notes Modal */}
      {isOrderNotesModalOpen && (
        <OrderNotesModal
          initialNotes={orderNotes}
          onClose={() => setIsOrderNotesModalOpen(false)}
          onSave={(notes) => setOrderNotes(notes)}
        />
      )}

      {/* Call Waiter Modal */}
      {isCallWaiterModalOpen && (
        <CallWaiterModal
          tableNumber={tableNumber}
          onClose={() => setIsCallWaiterModalOpen(false)}
        />
      )}
    </div>
  );
}
