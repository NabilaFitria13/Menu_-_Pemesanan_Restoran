import { MenuItem, RestaurantTable } from '../types/restaurant';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'prod-chicken-wings',
    name: 'Chicken Wings Madu Wijen',
    category: 'snack',
    price: 32000,
    originalPrice: 38000,
    description: 'Sayap ayam crispy bersalut saus madu gurih dengan taburan biji wijen sangrai dan parsley segar.',
    image: '/src/assets/images/food_chicken_wings_1792305248905.jpg',
    isPopular: true,
    isChefRecommendation: true,
    isAvailable: true,
    prepTimeMinutes: 12,
    allowSpiciness: true,
    availableToppings: [
      { id: 'top-cheese', name: 'Extra Keju Melted', price: 6000 },
      { id: 'top-bbq', name: 'Extra Dipping BBQ', price: 4000 },
      { id: 'top-garlic-mayo', name: 'Garlic Mayo Mayo', price: 4000 }
    ]
  },
  {
    id: 'prod-chicken-stick',
    name: 'Crispy Chicken Stick BBQ',
    category: 'snack',
    price: 20000,
    description: 'Fillet dada ayam olahan tepung renyah beraroma rempah disajikan dengan cocolan saus BBQ smokey.',
    image: '/src/assets/images/food_chicken_wings_1792305248905.jpg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 10,
    allowSpiciness: true,
    availableToppings: [
      { id: 'top-sambal-matah', name: 'Sambal Matah Bali', price: 5000 },
      { id: 'top-mayo', name: 'Japanese Mayo', price: 3000 }
    ]
  },
  {
    id: 'prod-chicken-popcorn',
    name: 'Chicken Popcorn Crispy',
    category: 'snack',
    price: 23000,
    description: 'Bite-sized potongan ayam renyah berbumbu bumbu bawang putih dan cabai bubuk gurih.',
    image: '/src/assets/images/food_chicken_wings_1792305248905.jpg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 8,
    allowSpiciness: true,
    availableToppings: [
      { id: 'top-seaweed', name: 'Bumbu Tabur Seaweed', price: 3000 },
      { id: 'top-spicy-chili', name: 'Extra Chili Flakes', price: 2000 }
    ]
  },
  {
    id: 'prod-dino-nugget',
    name: 'Dino Nugget Crunchy Gold',
    category: 'snack',
    price: 12000,
    description: 'Nugget ayam bentuk dino renyah disukai anak-anak maupun dewasa dengan saus tomat dan manis.',
    image: '/src/assets/images/food_chicken_wings_1792305248905.jpg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 7,
    allowSpiciness: false,
    availableToppings: [
      { id: 'top-cheese-powder', name: 'Bubuk Keju Cheddar', price: 3000 }
    ]
  },
  {
    id: 'prod-nasi-goreng-spesial',
    name: 'Nasi Goreng Spesial Resto',
    category: 'makanan',
    price: 35000,
    description: 'Nasi goreng racikan khas dengan telur mata sapi, sate ayam bumbu kacang, acar timur segar, dan kerupuk emping.',
    image: '/src/assets/images/food_nasi_goreng_1792305250018.jpg',
    isPopular: true,
    isChefRecommendation: true,
    isAvailable: true,
    prepTimeMinutes: 15,
    allowSpiciness: true,
    availableToppings: [
      { id: 'top-telur', name: 'Tambah Telur Ceplok/Dadar', price: 5000 },
      { id: 'top-ayam-suwir', name: 'Extra Daging Ayam Suwir', price: 8000 },
      { id: 'top-kerupuk', name: 'Kerupuk Udang Jumbo', price: 4000 }
    ]
  },
  {
    id: 'prod-mie-goreng-seafood',
    name: 'Mie Goreng Seafood Nusantara',
    category: 'makanan',
    price: 38000,
    originalPrice: 42000,
    description: 'Mie telur kenyal ditumis dengan udang segar, cumi, bakso ikan, sayuran kailan, dan bumbu kecap manis gurih.',
    image: '/src/assets/images/food_nasi_goreng_1792305250018.jpg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 14,
    allowSpiciness: true,
    availableToppings: [
      { id: 'top-udang-extra', name: 'Ekstra Udang Windu (3 pcs)', price: 12000 },
      { id: 'top-telur', name: 'Tambah Telur Mata Sapi', price: 5000 }
    ]
  },
  {
    id: 'prod-caramel-milkshake',
    name: 'Caramel Milkshake Whipped Cream',
    category: 'minuman',
    price: 26000,
    description: 'Susu segar creamy dipadukan sirup karamel bakar kental, topping whipped cream lembut dan saus salted caramel.',
    image: '/src/assets/images/food_caramel_milkshake_1792305248802.jpg',
    isPopular: true,
    isChefRecommendation: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    allowDrinkOptions: true,
    availableToppings: [
      { id: 'top-boba', name: 'Boba Brown Sugar', price: 4000 },
      { id: 'top-pudding', name: 'Caramel Egg Pudding', price: 5000 }
    ]
  },
  {
    id: 'prod-caramel-macchiato',
    name: 'Caramel Macchiato Double Shot',
    category: 'kopi',
    price: 30000,
    description: 'Espresso arabika gayo berlapis susu murni dingin dengan aroma vanila Madagascar dan drizzle saus karamel lezat.',
    image: '/src/assets/images/food_caramel_macchiato_1792305249390.jpg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 4,
    allowDrinkOptions: true,
    availableToppings: [
      { id: 'top-espresso', name: 'Extra Shot Espresso', price: 6000 },
      { id: 'top-oatmilk', name: 'Ganti Oat Milk Premium', price: 7000 }
    ]
  },
  {
    id: 'prod-choco-frappuccino',
    name: 'Chocolate Frappuccino Ice Blend',
    category: 'minuman',
    price: 39000,
    description: 'Blended Belgian cokelat pekat dengan choco chips renyah, whipped cream melimpah, dan parutan dark cokelat.',
    image: '/src/assets/images/food_caramel_milkshake_1792305248802.jpg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 6,
    allowDrinkOptions: true,
    availableToppings: [
      { id: 'top-choco-icecream', name: 'Scoop Ice Cream Cokelat', price: 7000 },
      { id: 'top-oreo', name: 'Remahan Biskuit Oreo', price: 4000 }
    ]
  },
  {
    id: 'prod-matcha-latte',
    name: 'Kyoto Creamy Matcha Latte',
    category: 'minuman',
    price: 29000,
    description: 'Matcha otentik Jepang berpadu dengan kelembutan susu fresh milk dingin, manis pas dan tidak pahit.',
    image: '/src/assets/images/food_caramel_macchiato_1792305249390.jpg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 4,
    allowDrinkOptions: true,
    availableToppings: [
      { id: 'top-grassjelly', name: 'Grass Jelly Cincau', price: 4000 }
    ]
  },
  {
    id: 'prod-dancing-ice-cream',
    name: 'Dancing Ice Cream Cone Vanilla',
    category: 'dessert',
    price: 14000,
    description: 'Soft serve ice cream vanilla creamy dalam waffle cone renyah dengan siraman saus cokelat manis.',
    image: '/src/assets/images/food_custom_cake_1792305249688.jpg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 3,
    allowDrinkOptions: false,
    availableToppings: [
      { id: 'top-sprinkles', name: 'Rainbow Sprinkles', price: 2000 },
      { id: 'top-almond', name: 'Almond Slice Panggang', price: 4000 }
    ]
  },
  {
    id: 'prod-custom-cake',
    name: 'Strawberry Velvet Slice Cake',
    category: 'dessert',
    price: 28000,
    description: 'Kue spons red velvet lembut berlapis krim keju vanilla segar dan potongan buah stroberi utuh berkilau.',
    image: '/src/assets/images/food_custom_cake_1792305249688.jpg',
    isPopular: true,
    isChefRecommendation: true,
    isAvailable: true,
    prepTimeMinutes: 3,
    allowDrinkOptions: false,
    availableToppings: [
      { id: 'top-berry-sauce', name: 'Extra Saus Stroberi', price: 3000 }
    ]
  },
  {
    id: 'prod-paket-combo-hemat',
    name: 'Paket Hemat: Wings + Milkshake',
    category: 'paket',
    price: 52000,
    originalPrice: 58000,
    description: 'Kombinasi juara: 1 porsi Chicken Wings Madu Wijen + 1 Caramel Milkshake segar.',
    image: '/src/assets/images/food_chicken_wings_1792305248905.jpg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 12,
    allowSpiciness: true,
    allowDrinkOptions: true,
    availableToppings: [
      { id: 'top-fries', name: 'Tambah French Fries Mini', price: 8000 }
    ]
  }
];

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: 't-01', name: 'Meja 01', capacity: 2, status: 'available' },
  { id: 't-02', name: 'Meja 02', capacity: 4, status: 'available' },
  { id: 't-03', name: 'Meja 03', capacity: 4, status: 'occupied', activeOrderId: 'ORD-101' },
  { id: 't-04', name: 'Meja 04', capacity: 4, status: 'available' },
  { id: 't-05', name: 'Meja 05', capacity: 6, status: 'available' },
  { id: 't-06', name: 'Meja 06', capacity: 2, status: 'available' },
  { id: 't-07', name: 'Meja 07 (VIP)', capacity: 8, status: 'reserved' },
  { id: 't-08', name: 'Meja 08 (Outdoor)', capacity: 4, status: 'available' },
  { id: 't-09', name: 'Meja 09 (Outdoor)', capacity: 4, status: 'occupied', activeOrderId: 'ORD-102' },
  { id: 't-10', name: 'Meja 10 (Bar)', capacity: 2, status: 'available' },
];

export const AVAILABLE_PROMOS: { [key: string]: { discountPercent?: number; discountAmount?: number; desc: string; minSubtotal: number } } = {
  'MAKANENAK': { discountPercent: 15, desc: 'Diskon 15% Spesial Dine In (Maks Rp 25.000)', minSubtotal: 50000 },
  'SELERA10': { discountPercent: 10, desc: 'Diskon 10% Semua Menu', minSubtotal: 30000 },
  'HEMAT20': { discountAmount: 20000, desc: 'Potongan Langsung Rp 20.000', minSubtotal: 100000 },
};
