export type OrderType = 'dine_in' | 'take_away';

export type PaymentMethod = 'qris' | 'cash' | 'card' | 'voucher';

export type OrderStatus = 'submitted' | 'cooking' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface MenuOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'makanan' | 'snack' | 'kopi' | 'minuman' | 'dessert' | 'paket';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isPopular?: boolean;
  isChefRecommendation?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  allowSpiciness?: boolean;
  allowDrinkOptions?: boolean;
  availableToppings?: MenuOption[];
}

export interface SelectedModifier {
  spiciness?: 'Tidak Pedas' | 'Level 1 (Sedang)' | 'Level 2 (Pedas Mantap)' | 'Level 3 (Ekstra Pedas)';
  ice?: 'Normal Ice' | 'Less Ice' | 'No Ice';
  sweetness?: 'Normal Sugar' | 'Less Sugar (50%)' | 'No Sugar (0%)';
  size?: 'Reguler' | 'Large (+Rp 6.000)';
  toppings: MenuOption[];
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers: SelectedModifier;
  unitPriceWithModifiers: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: OrderType;
  pax: number;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number; // PB1 10%
  serviceCharge: number; // 5%
  discount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  createdAt: string; // ISO string
  cashReceived?: number;
  cashChange?: number;
  orderNotes?: string;
}

export interface RestaurantTable {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  activeOrderId?: string;
}
