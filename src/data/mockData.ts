import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import food4 from "@/assets/food-4.jpg";
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";

// ─── Food & Restaurant Types ────────────────────────────────────────────────

export type FoodStatus = "available" | "sold_out" | "time_based";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: FoodStatus;
  availableTime?: string;
  rating: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  priceRange: string;
  isOpen: boolean;
  address: string;
  phone: string;
  description: string;
  menu: MenuItem[];
  tables: TableInfo[];
}

export interface TableInfo {
  id: string;
  seats: number;
  available: boolean;
  location: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  tableId: string;
  preOrder?: CartItem[];
  checkedIn?: boolean;
  deposit?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  total: number;
  status: "preparing" | "almost_ready" | "ready" | "served" | "completed";
  createdAt: string;
  estimatedTime: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  streak: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  totalOrders: number;
  role: "customer" | "restaurant" | "admin";
  favorites: string[];
  restaurantId?: string; // for restaurant owners
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiresAt: string;
  type: "percentage" | "fixed" | "freeItem";
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
  reply?: string;
  menuItemId?: string;
  menuItemName?: string;
}

// ─── Story Types ────────────────────────────────────────────────────────────

export type StoryType = "image" | "video";

export interface StoryItem {
  id: string;
  type: StoryType;
  url: string;
  thumbnail?: string;
  caption?: string;
  createdAt: string;
  duration?: number; // seconds, for video
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: "customer" | "restaurant";
  restaurantId?: string;
  restaurantName?: string;
  items: StoryItem[];
  seen: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "wallet" | "cash";
  label: string;
  last4?: string;
  icon: string;
  isDefault: boolean;
}

export type AddressLabelType = "home" | "work" | "other";

export interface SavedAddress {
  id: string;
  labelType: AddressLabelType;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  details?: string;
  note?: string;
  latitude: number;
  longitude: number;
  zone: string;
  isDefault: boolean;
}

export interface AddressSearchPlace {
  id: string;
  title: string;
  subtitle: string;
  zone: string;
  latitude: number;
  longitude: number;
  etaMinutes: string;
  markerX: number;
  markerY: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promo" | "reservation" | "system";
  read: boolean;
  createdAt: string;
}

// ─── Admin & Owner Types ────────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "restaurant" | "admin";
  status: "active" | "suspended" | "pending";
  joinedAt: string;
  totalOrders: number;
}

export interface SystemEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "holiday" | "festival" | "promotion" | "maintenance";
  status: "active" | "scheduled" | "completed";
  targetAudience: "all" | "customers" | "restaurants";
}

export interface RestaurantApplication {
  id: string;
  name: string;
  ownerName: string;
  cuisine: string;
  address: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  averageRating: number;
}

// ─── Categories ─────────────────────────────────────────────────────────────

export const categories = [
  { id: "all", name: "All", emoji: "🍽️" },
  { id: "khmer", name: "Khmer", emoji: "🇰🇭" },
  { id: "street", name: "Street Food", emoji: "🥡" },
  { id: "noodles", name: "Noodles", emoji: "🍜" },
  { id: "bbq", name: "BBQ & Grill", emoji: "🥩" },
  { id: "dessert", name: "Desserts", emoji: "🍰" },
  { id: "drinks", name: "Drinks", emoji: "🥤" },
];

// ─── Restaurants (Phnom Penh, Cambodia) ─────────────────────────────────────

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Malis Restaurant",
    cuisine: "Khmer",
    image: restaurant1,
    rating: 4.8,
    reviewCount: 524,
    distance: "1.2 km",
    deliveryTime: "25-35 min",
    priceRange: "$$",
    isOpen: true,
    address: "No. 136, Street 41, BKK1, Phnom Penh",
    phone: "+855 23 221 022",
    description:
      "Award-winning Khmer fine dining by Chef Luu Meng. Traditional Cambodian recipes elevated with modern techniques and locally sourced ingredients.",
    tables: [
      { id: "t1", seats: 2, available: true, location: "Garden" },
      { id: "t2", seats: 4, available: true, location: "Indoor" },
      { id: "t3", seats: 6, available: false, location: "Private Room" },
      { id: "t4", seats: 2, available: true, location: "Terrace" },
    ],
    menu: [
      {
        id: "m1",
        name: "Fish Amok",
        description:
          "Signature steamed fish curry in banana leaf with coconut cream, lemongrass & kroeung paste",
        price: 7.5,
        image: food1,
        category: "khmer",
        status: "available",
        rating: 4.9,
      },
      {
        id: "m2",
        name: "Lok Lak",
        description:
          "Stir-fried marinated beef with Kampot pepper sauce, served with rice & fried egg",
        price: 6.5,
        image: food1,
        category: "khmer",
        status: "available",
        rating: 4.8,
      },
      {
        id: "m3",
        name: "Prahok Ktiss",
        description:
          "Creamy fermented fish dip with minced pork, served with fresh vegetables",
        price: 5.0,
        image: food1,
        category: "khmer",
        status: "time_based",
        availableTime: "11:00 AM - 3:00 PM",
        rating: 4.7,
      },
      {
        id: "m4",
        name: "Num Banh Chok",
        description:
          "Traditional Khmer rice noodles with green fish curry, fresh herbs & bean sprouts",
        price: 4.0,
        image: food1,
        category: "noodles",
        status: "available",
        rating: 4.6,
      },
      {
        id: "m5",
        name: "Iced Coconut Coffee",
        description:
          "Rich Cambodian coffee blended with coconut cream over ice",
        price: 2.5,
        image: food1,
        category: "drinks",
        status: "sold_out",
        rating: 4.5,
      },
    ],
  },
  {
    id: "2",
    name: "Romdeng",
    cuisine: "Khmer",
    image: restaurant2,
    rating: 4.6,
    reviewCount: 412,
    distance: "0.8 km",
    deliveryTime: "20-30 min",
    priceRange: "$$",
    isOpen: true,
    address: "No. 74, Street 174, Phsar Kandal, Phnom Penh",
    phone: "+855 92 219 565",
    description:
      "Traditional Cambodian cuisine in a beautiful colonial villa. A social enterprise by Friends International supporting youth.",
    tables: [
      { id: "t5", seats: 2, available: true, location: "Courtyard" },
      { id: "t6", seats: 4, available: true, location: "Indoor" },
      { id: "t7", seats: 8, available: true, location: "Garden" },
    ],
    menu: [
      {
        id: "m6",
        name: "Fried Tarantula",
        description:
          "Crispy fried spider with Kampot pepper & lime — a Cambodian delicacy from Skuon",
        price: 5.5,
        image: food2,
        category: "street",
        status: "available",
        rating: 4.9,
      },
      {
        id: "m7",
        name: "Kampot Pepper Squid",
        description:
          "Grilled squid with fresh Kampot green peppercorns & garlic",
        price: 7.0,
        image: food2,
        category: "khmer",
        status: "available",
        rating: 4.7,
      },
      {
        id: "m8",
        name: "Beef Saraman Curry",
        description:
          "Slow-cooked Khmer curry with star anise, cardamom & roasted peanuts",
        price: 8.0,
        image: food2,
        category: "khmer",
        status: "time_based",
        availableTime: "5:00 PM - 10:00 PM",
        rating: 4.8,
      },
      {
        id: "m9",
        name: "Sticky Rice & Mango",
        description:
          "Sweet glutinous rice with fresh Cambodian mango & coconut cream",
        price: 3.5,
        image: food2,
        category: "dessert",
        status: "available",
        rating: 4.5,
      },
    ],
  },
  {
    id: "3",
    name: "Sugar Palm",
    cuisine: "Khmer",
    image: restaurant3,
    rating: 4.5,
    reviewCount: 289,
    distance: "1.5 km",
    deliveryTime: "30-40 min",
    priceRange: "$",
    isOpen: true,
    address: "No. 19, Street 240, BKK1, Phnom Penh",
    phone: "+855 23 220 956",
    description:
      "Home-style Cambodian cooking by Chef Kethana. Authentic family recipes in a warm, welcoming atmosphere.",
    tables: [
      { id: "t8", seats: 2, available: false, location: "Window" },
      { id: "t9", seats: 4, available: true, location: "Main Hall" },
      { id: "t10", seats: 6, available: true, location: "Balcony" },
    ],
    menu: [
      {
        id: "m10",
        name: "Bai Sach Chrouk",
        description:
          "Grilled pork with broken rice, pickled daikon & a bowl of clear broth",
        price: 3.5,
        image: food3,
        category: "street",
        status: "available",
        rating: 4.8,
      },
      {
        id: "m11",
        name: "Cha Kreung Chicken",
        description:
          "Stir-fried chicken with lemongrass paste (kroeung), kaffir lime & Thai basil",
        price: 5.5,
        image: food3,
        category: "khmer",
        status: "available",
        rating: 4.6,
      },
      {
        id: "m12",
        name: "Samlor Machu",
        description:
          "Traditional Khmer sour soup with tamarind, pineapple, tomato & fresh fish",
        price: 4.5,
        image: food3,
        category: "khmer",
        status: "sold_out",
        rating: 4.5,
      },
      {
        id: "m13",
        name: "Sugarcane Juice",
        description:
          "Freshly pressed sugarcane juice with a squeeze of calamansi lime",
        price: 1.5,
        image: food3,
        category: "drinks",
        status: "available",
        rating: 4.4,
      },
    ],
  },
  {
    id: "4",
    name: "Sovanna BBQ",
    cuisine: "BBQ & Grill",
    image: restaurant4,
    rating: 4.7,
    reviewCount: 367,
    distance: "2.0 km",
    deliveryTime: "25-35 min",
    priceRange: "$$",
    isOpen: false,
    address: "No. 21, Riverside (Sisowath Quay), Phnom Penh",
    phone: "+855 12 888 999",
    description:
      "Phnom Penh's favorite BBQ spot. Smoky grilled meats, fresh seafood, and ice-cold drinks by the riverside.",
    tables: [
      { id: "t11", seats: 2, available: true, location: "Riverside" },
      { id: "t12", seats: 4, available: true, location: "Indoor" },
      { id: "t13", seats: 10, available: true, location: "Party Room" },
    ],
    menu: [
      {
        id: "m14",
        name: "BBQ Beef Skewers",
        description:
          "Marinated beef skewers grilled over charcoal with Kampot pepper dip",
        price: 5.0,
        image: food4,
        category: "bbq",
        status: "available",
        rating: 4.9,
      },
      {
        id: "m15",
        name: "Grilled Pork Ribs",
        description:
          "Slow-grilled pork ribs with palm sugar glaze & pickled vegetables",
        price: 7.5,
        image: food4,
        category: "bbq",
        status: "available",
        rating: 4.7,
      },
      {
        id: "m16",
        name: "Nom Krok",
        description:
          "Crispy Cambodian coconut pancakes with green onion — a beloved street snack",
        price: 2.5,
        image: food4,
        category: "dessert",
        status: "available",
        rating: 4.6,
      },
      {
        id: "m17",
        name: "Angkor Draft Beer",
        description:
          "Ice-cold draft Angkor beer — Cambodia's most beloved lager",
        price: 1.5,
        image: food4,
        category: "drinks",
        status: "time_based",
        availableTime: "4:00 PM - 11:00 PM",
        rating: 4.5,
      },
    ],
  },
];

// ─── Reservations ───────────────────────────────────────────────────────────

export const mockReservations: Reservation[] = [
  {
    id: "r1",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    date: "2026-02-18",
    time: "19:00",
    guests: 2,
    status: "confirmed",
    tableId: "t1",
    checkedIn: false,
    deposit: 10.0,
    preOrder: [
      { menuItem: restaurants[0].menu[0], quantity: 2 },
      { menuItem: restaurants[0].menu[1], quantity: 1 },
    ],
  },
  {
    id: "r2",
    restaurantId: "2",
    restaurantName: "Romdeng",
    restaurantImage: restaurant2,
    date: "2026-02-20",
    time: "12:30",
    guests: 4,
    status: "pending",
    tableId: "t6",
  },
  {
    id: "r3",
    restaurantId: "3",
    restaurantName: "Sugar Palm",
    restaurantImage: restaurant3,
    date: "2026-02-15",
    time: "18:00",
    guests: 3,
    status: "completed",
    tableId: "t9",
  },
];

// ─── Orders ─────────────────────────────────────────────────────────────────

export const mockOrders: Order[] = [
  {
    id: "ord1",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [
      { menuItem: restaurants[0].menu[0], quantity: 2 },
      { menuItem: restaurants[0].menu[1], quantity: 1 },
    ],
    total: 21.5,
    status: "preparing",
    createdAt: "2026-02-17T18:30:00",
    estimatedTime: "25 min",
  },
  {
    id: "ord2",
    restaurantId: "2",
    restaurantName: "Romdeng",
    restaurantImage: restaurant2,
    items: [
      { menuItem: restaurants[1].menu[0], quantity: 1 },
      { menuItem: restaurants[1].menu[1], quantity: 2 },
    ],
    total: 19.5,
    status: "almost_ready",
    createdAt: "2026-02-17T17:45:00",
    estimatedTime: "5 min",
  },
  {
    id: "ord3",
    restaurantId: "3",
    restaurantName: "Sugar Palm",
    restaurantImage: restaurant3,
    items: [{ menuItem: restaurants[2].menu[0], quantity: 1 }],
    total: 3.5,
    status: "completed",
    createdAt: "2026-02-16T12:00:00",
    estimatedTime: "Done",
  },
];

// ─── Users (Mock) ───────────────────────────────────────────────────────────

export const mockUser: UserProfile = {
  name: "Sokha Chea",
  email: "sokha@example.com",
  phone: "+855 12 345 678",
  avatar: "",
  loyaltyPoints: 2450,
  streak: 5,
  tier: "Gold",
  totalOrders: 47,
  role: "customer",
  favorites: ["1", "2"],
};

export const mockRestaurantOwner: UserProfile = {
  name: "Bopha Seng",
  email: "bopha@malis.com.kh",
  phone: "+855 12 888 001",
  avatar: "",
  loyaltyPoints: 0,
  streak: 0,
  tier: "Platinum",
  totalOrders: 0,
  role: "restaurant",
  favorites: [],
  restaurantId: "1",
};

export const mockAdmin: UserProfile = {
  name: "Chanthy Kem",
  email: "chanthy@nhamey.com.kh",
  phone: "+855 10 000 001",
  avatar: "",
  loyaltyPoints: 0,
  streak: 0,
  tier: "Platinum",
  totalOrders: 0,
  role: "admin",
  favorites: [],
};

// ─── Promotions (Cambodian Context) ─────────────────────────────────────────

export const mockPromotions: Promotion[] = [
  {
    id: "p1",
    title: "Khmer New Year Special",
    description: "Celebrate ចូលឆ្នាំថ្មី with 20% off all Khmer dishes",
    discount: "20%",
    code: "KNY2026",
    expiresAt: "2026-04-16",
    type: "percentage",
  },
  {
    id: "p2",
    title: "Free Dessert Friday",
    description: "Order any main course and get a free Nom Krok",
    discount: "Free Item",
    code: "SWEETFRI",
    expiresAt: "2026-03-01",
    type: "freeItem",
  },
  {
    id: "p3",
    title: "សួស្តី Welcome!",
    description: "$2 off your first order above $10",
    discount: "$2",
    code: "SUOSTEI",
    expiresAt: "2026-12-31",
    type: "fixed",
  },
  {
    id: "p4",
    title: "Streak Bonus! 🔥",
    description: "5-day streak! Enjoy 15% off your next order",
    discount: "15%",
    code: "STREAK15",
    expiresAt: "2026-02-19",
    type: "percentage",
  },
];

// ─── Reviews ────────────────────────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: "rev1",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    userName: "Sokha Chea",
    userAvatar: "",
    rating: 5,
    comment:
      "ហាងអាហារខ្មែរដ៏អស្ចារ្យ! The Fish Amok here is the best in Phnom Penh. Amazing atmosphere and service!",
    date: "2026-01-15",
    photos: [food1],
    reply:
      "អរគុណ! Thank you for your kind words! We look forward to welcoming you again.",
    menuItemId: "m1",
    menuItemName: "Fish Amok",
  },
  {
    id: "rev2",
    restaurantId: "2",
    restaurantName: "Romdeng",
    userName: "Dara Pich",
    userAvatar: "",
    rating: 4,
    comment:
      "Love the Fried Tarantula — you have to try it! Beautiful colonial setting. Great cause too.",
    date: "2026-01-10",
    photos: [food2],
    menuItemId: "m6",
    menuItemName: "Fried Tarantula",
  },
  {
    id: "rev3",
    restaurantId: "3",
    restaurantName: "Sugar Palm",
    userName: "Srey Leak Ny",
    userAvatar: "",
    rating: 5,
    comment:
      "Best Bai Sach Chrouk in the city! Reminds me of my grandmother's cooking. ពិតជាឆ្ងាញ់!",
    date: "2026-01-05",
    menuItemId: "m10",
    menuItemName: "Bai Sach Chrouk",
  },
  {
    id: "rev4",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    userName: "Vanna Ros",
    userAvatar: "",
    rating: 4,
    comment:
      "The Lok Lak is perfectly seasoned with Kampot pepper. Great service and beautiful presentation.",
    date: "2026-02-01",
    photos: [food1],
    menuItemId: "m2",
    menuItemName: "Lok Lak",
  },
  {
    id: "rev5",
    restaurantId: "4",
    restaurantName: "Sovanna BBQ",
    userName: "Sokha Chea",
    userAvatar: "",
    rating: 5,
    comment:
      "Best BBQ spot by the riverside! The beef skewers are incredible. Perfect with an Angkor beer.",
    date: "2026-02-10",
    photos: [food4],
    menuItemId: "m14",
    menuItemName: "BBQ Beef Skewers",
  },
];

// ─── Stories ────────────────────────────────────────────────────────────────

export const mockStories: Story[] = [
  {
    id: "story1",
    userId: "u4",
    userName: "Malis Restaurant",
    userAvatar: "",
    userRole: "restaurant",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    items: [
      {
        id: "si1",
        type: "image",
        url: restaurant1,
        caption: "Fresh Fish Amok prepared with love today! 🐟✨",
        createdAt: "2026-02-19T08:00:00",
      },
      {
        id: "si2",
        type: "image",
        url: food1,
        caption: "Our chef's special lunch set — only $5.99! Limited time 🔥",
        createdAt: "2026-02-19T10:30:00",
      },
    ],
    seen: false,
  },
  {
    id: "story2",
    userId: "u5",
    userName: "Romdeng",
    userAvatar: "",
    userRole: "restaurant",
    restaurantId: "2",
    restaurantName: "Romdeng",
    items: [
      {
        id: "si3",
        type: "image",
        url: restaurant2,
        caption: "Beautiful evening at our courtyard garden 🌿",
        createdAt: "2026-02-19T17:00:00",
      },
      {
        id: "si4",
        type: "image",
        url: food2,
        caption: "Dare to try our famous Fried Tarantula? 🕷️😋",
        createdAt: "2026-02-19T17:30:00",
      },
    ],
    seen: false,
  },
  {
    id: "story3",
    userId: "u1",
    userName: "Sokha",
    userAvatar: "",
    userRole: "customer",
    items: [
      {
        id: "si5",
        type: "image",
        url: food3,
        caption: "Amazing dinner at Sugar Palm tonight! 😍",
        createdAt: "2026-02-18T20:00:00",
      },
    ],
    seen: false,
  },
  {
    id: "story4",
    userId: "u-r3",
    userName: "Sugar Palm",
    userAvatar: "",
    userRole: "restaurant",
    restaurantId: "3",
    restaurantName: "Sugar Palm",
    items: [
      {
        id: "si6",
        type: "image",
        url: restaurant3,
        caption: "New balcony seating now open! Come enjoy the view 🌅",
        createdAt: "2026-02-19T09:00:00",
      },
    ],
    seen: true,
  },
  {
    id: "story5",
    userId: "u2",
    userName: "Dara",
    userAvatar: "",
    userRole: "customer",
    items: [
      {
        id: "si7",
        type: "image",
        url: food4,
        caption: "BBQ night with friends at Sovanna! 🥩🔥",
        createdAt: "2026-02-18T19:00:00",
      },
    ],
    seen: true,
  },
  {
    id: "story6",
    userId: "u-r4",
    userName: "Sovanna BBQ",
    userAvatar: "",
    userRole: "restaurant",
    restaurantId: "4",
    restaurantName: "Sovanna BBQ",
    items: [
      {
        id: "si8",
        type: "image",
        url: restaurant4,
        caption: "Weekend special: Buy 1 Get 1 on all skewers! 🎉",
        createdAt: "2026-02-19T11:00:00",
      },
      {
        id: "si9",
        type: "image",
        url: food4,
        caption: "Our signature Grilled Pork Ribs — now with palm sugar glaze!",
        createdAt: "2026-02-19T12:00:00",
      },
    ],
    seen: false,
  },
];

// ─── Payment Methods (Cambodian) ────────────────────────────────────────────

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "wallet",
    label: "ABA KHQR",
    icon: "📱",
    isDefault: true,
  },
  {
    id: "pm2",
    type: "wallet",
    label: "Wing Money",
    icon: "💳",
    isDefault: false,
  },
  {
    id: "pm3",
    type: "cash",
    label: "Cash on Delivery",
    icon: "💵",
    isDefault: false,
  },
  {
    id: "pm4",
    type: "card",
    label: "Visa",
    last4: "4242",
    icon: "💳",
    isDefault: false,
  },
];

// ─── Customer Addresses (Mock) ──────────────────────────────────────────────

export const mockSavedAddresses: SavedAddress[] = [
  {
    id: "addr1",
    labelType: "home",
    label: "Home",
    recipientName: "Sokha Chea",
    phone: "+855 12 345 678",
    addressLine:
      "PPP3 Office, Lum Village, Sangkat Poipet, Krong Poipet, Banteay Meanchey",
    details: "Near blue canal road, opposite PPP NEW",
    note: "Call on arrival. Security at gate.",
    latitude: 13.6507,
    longitude: 102.5605,
    zone: "Poipet Border Canal",
    isDefault: true,
  },
  {
    id: "addr2",
    labelType: "work",
    label: "Office",
    recipientName: "Sokha Chea",
    phone: "+855 12 345 678",
    addressLine:
      "999 POIPET BUILDING, National Road 5, Krong Poipet, Banteay Meanchey",
    details: "3rd Floor, Admin Office",
    note: "Deliver before 6:00 PM.",
    latitude: 13.6588,
    longitude: 102.563,
    zone: "Poipet North Block",
    isDefault: false,
  },
];

export const mockAddressSearchPlaces: AddressSearchPlace[] = [
  {
    id: "place1",
    title: "PPP3 Office",
    subtitle: "Border canal road, Lum Village, Krong Poipet",
    zone: "Poipet Border Canal",
    latitude: 13.6507,
    longitude: 102.5605,
    etaMinutes: "10-15 min",
    markerX: 35,
    markerY: 76,
  },
  {
    id: "place2",
    title: "999 POIPET BUILDING",
    subtitle: "North canal road, Krong Poipet",
    zone: "Poipet North Block",
    latitude: 13.6588,
    longitude: 102.563,
    etaMinutes: "12-18 min",
    markerX: 49,
    markerY: 19,
  },
  {
    id: "place3",
    title: "The Patriot Hairstudio",
    subtitle: "West lane, Lum Village, Krong Poipet",
    zone: "Poipet West Lane",
    latitude: 13.6569,
    longitude: 102.5574,
    etaMinutes: "12-18 min",
    markerX: 24,
    markerY: 34,
  },
  {
    id: "place4",
    title: "Las Vegas Club Poipet",
    subtitle: "Canal-side avenue, Krong Poipet",
    zone: "Poipet Central Canal",
    latitude: 13.6548,
    longitude: 102.5602,
    etaMinutes: "11-16 min",
    markerX: 41,
    markerY: 47,
  },
  {
    id: "place5",
    title: "Good Time",
    subtitle: "Market lane east side, Krong Poipet",
    zone: "Poipet Market Lane",
    latitude: 13.6532,
    longitude: 102.5645,
    etaMinutes: "9-14 min",
    markerX: 63,
    markerY: 58,
  },
  {
    id: "place6",
    title: "KOP INDONESIA",
    subtitle: "Commercial row by canal, Krong Poipet",
    zone: "Poipet Commercial Row",
    latitude: 13.6538,
    longitude: 102.5638,
    etaMinutes: "9-14 min",
    markerX: 57,
    markerY: 55,
  },
  {
    id: "place7",
    title: "Gold Planet Casino & Resort",
    subtitle: "East block, Krong Poipet",
    zone: "Poipet East Block",
    latitude: 13.6558,
    longitude: 102.568,
    etaMinutes: "14-20 min",
    markerX: 86,
    markerY: 38,
  },
  {
    id: "place8",
    title: "One Budget Hotel",
    subtitle: "West side road, near border line",
    zone: "Poipet Border West",
    latitude: 13.652,
    longitude: 102.5578,
    etaMinutes: "13-19 min",
    markerX: 25,
    markerY: 64,
  },
  {
    id: "place9",
    title: "Resto Dapur Gen-Z",
    subtitle: "Northern street, Krong Poipet",
    zone: "Poipet North Street",
    latitude: 13.6601,
    longitude: 102.5654,
    etaMinutes: "13-19 min",
    markerX: 71,
    markerY: 10,
  },
  {
    id: "place10",
    title: "PPP NEW",
    subtitle: "South border lane, Krong Poipet",
    zone: "Poipet South Border",
    latitude: 13.6489,
    longitude: 102.5596,
    etaMinutes: "11-16 min",
    markerX: 31,
    markerY: 87,
  },
];

// ─── Notifications ──────────────────────────────────────────────────────────

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "Order Confirmed ✅",
    message: "Your order from Malis Restaurant is being prepared. ETA: 25 min.",
    type: "order",
    read: false,
    createdAt: "2026-02-18T10:30:00",
  },
  {
    id: "n2",
    title: "Reservation Reminder",
    message:
      "Your reservation at Malis Restaurant is tonight at 7:00 PM. Don't forget!",
    type: "reservation",
    read: false,
    createdAt: "2026-02-17T18:00:00",
  },
  {
    id: "n3",
    title: "🎊 Khmer New Year Sale!",
    message:
      "Use code KNY2026 for 20% off all Khmer dishes. Celebrate with us!",
    type: "promo",
    read: true,
    createdAt: "2026-02-16T09:00:00",
  },
  {
    id: "n4",
    title: "Streak Alert 🔥",
    message:
      "You're on a 5-day streak! Order today to keep it going and unlock 15% off.",
    type: "system",
    read: true,
    createdAt: "2026-02-15T08:00:00",
  },
  {
    id: "n5",
    title: "Order Ready!",
    message: "Your order from Romdeng is almost ready for pickup.",
    type: "order",
    read: true,
    createdAt: "2026-02-14T19:30:00",
  },
];

// ─── Admin: User Records ────────────────────────────────────────────────────

export const mockUserRecords: UserRecord[] = [
  {
    id: "u1",
    name: "Sokha Chea",
    email: "sokha@example.com",
    phone: "+855 12 345 678",
    role: "customer",
    status: "active",
    joinedAt: "2025-06-15",
    totalOrders: 47,
  },
  {
    id: "u2",
    name: "Dara Pich",
    email: "dara@example.com",
    phone: "+855 15 222 333",
    role: "customer",
    status: "active",
    joinedAt: "2025-08-20",
    totalOrders: 23,
  },
  {
    id: "u3",
    name: "Srey Leak Ny",
    email: "sreyleak@example.com",
    phone: "+855 16 444 555",
    role: "customer",
    status: "suspended",
    joinedAt: "2025-09-10",
    totalOrders: 5,
  },
  {
    id: "u4",
    name: "Bopha Seng",
    email: "bopha@malis.com.kh",
    phone: "+855 12 888 001",
    role: "restaurant",
    status: "active",
    joinedAt: "2025-03-01",
    totalOrders: 0,
  },
  {
    id: "u5",
    name: "Vanna Ros",
    email: "vanna@romdeng.com.kh",
    phone: "+855 92 219 565",
    role: "restaurant",
    status: "active",
    joinedAt: "2025-04-10",
    totalOrders: 0,
  },
  {
    id: "u6",
    name: "Rithea Sao",
    email: "rithea@example.com",
    phone: "+855 17 111 222",
    role: "customer",
    status: "pending",
    joinedAt: "2026-02-17",
    totalOrders: 0,
  },
  {
    id: "u7",
    name: "Chanthy Kem",
    email: "chanthy@nhamey.com.kh",
    phone: "+855 10 000 001",
    role: "admin",
    status: "active",
    joinedAt: "2025-01-01",
    totalOrders: 0,
  },
];

// ─── Admin: Restaurant Applications ─────────────────────────────────────────

export const mockRestaurantApplications: RestaurantApplication[] = [
  {
    id: "ra1",
    name: "Phnom Penh Noodle House",
    ownerName: "Kimhour Chan",
    cuisine: "Noodles",
    address: "No. 55, Street 130, Phsar Chas, Phnom Penh",
    phone: "+855 12 556 789",
    status: "pending",
    appliedAt: "2026-02-16",
  },
  {
    id: "ra2",
    name: "Kep Crab Market",
    ownerName: "Narith Lim",
    cuisine: "Seafood",
    address: "No. 8, Riverside, Phnom Penh",
    phone: "+855 16 678 901",
    status: "pending",
    appliedAt: "2026-02-15",
  },
  {
    id: "ra3",
    name: "Battambang Kitchen",
    ownerName: "Sopheap Men",
    cuisine: "Khmer",
    address: "No. 12, Street 63, BKK1, Phnom Penh",
    phone: "+855 15 234 567",
    status: "approved",
    appliedAt: "2026-02-10",
  },
  {
    id: "ra4",
    name: "Siem Reap Bites",
    ownerName: "Piseth Chhun",
    cuisine: "Street Food",
    address: "No. 3, Street 178, Daun Penh, Phnom Penh",
    phone: "+855 17 345 678",
    status: "rejected",
    appliedAt: "2026-02-08",
  },
];

// ─── Admin: System Events (Cambodian) ───────────────────────────────────────

export const mockSystemEvents: SystemEvent[] = [
  {
    id: "se1",
    title: "Khmer New Year Festival 🇰🇭",
    description:
      "Celebrate Choul Chnam Thmey (ចូលឆ្នាំថ្មី) with special restaurant deals and free delivery across Phnom Penh.",
    startDate: "2026-04-13",
    endDate: "2026-04-16",
    type: "festival",
    status: "scheduled",
    targetAudience: "all",
  },
  {
    id: "se2",
    title: "Water Festival (Bon Om Touk) 🚣",
    description:
      "Enjoy riverside dining deals during Cambodia's beloved Water Festival. Special boat-themed menus!",
    startDate: "2026-11-14",
    endDate: "2026-11-16",
    type: "festival",
    status: "scheduled",
    targetAudience: "all",
  },
  {
    id: "se3",
    title: "Pchum Ben Promotion 🙏",
    description:
      "Honor ancestors with traditional food specials during Pchum Ben. Discounts on all Khmer dishes.",
    startDate: "2026-09-20",
    endDate: "2026-10-06",
    type: "holiday",
    status: "scheduled",
    targetAudience: "customers",
  },
  {
    id: "se4",
    title: "Platform Maintenance 🔧",
    description:
      "System update to improve order tracking and payment processing. Brief downtime expected.",
    startDate: "2026-02-25",
    endDate: "2026-02-25",
    type: "maintenance",
    status: "scheduled",
    targetAudience: "all",
  },
  {
    id: "se5",
    title: "Valentine's Day Special 💝",
    description: "Couple dinner sets at partner restaurants across Phnom Penh.",
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    type: "promotion",
    status: "completed",
    targetAudience: "customers",
  },
];

// ─── Admin: Platform Stats ──────────────────────────────────────────────────

export const mockPlatformStats: PlatformStats = {
  totalUsers: 12450,
  totalRestaurants: 156,
  totalOrders: 89320,
  totalRevenue: 534000,
  activeUsers: 4200,
  averageRating: 4.6,
};

// ─── Owner: Incoming Orders (for restaurant owner dashboard) ────────────────

export const mockOwnerOrders: Order[] = [
  {
    id: "oo1",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [
      { menuItem: restaurants[0].menu[0], quantity: 2 },
      { menuItem: restaurants[0].menu[1], quantity: 1 },
    ],
    total: 21.5,
    status: "preparing",
    createdAt: "2026-02-18T11:30:00",
    estimatedTime: "20 min",
  },
  {
    id: "oo2",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [{ menuItem: restaurants[0].menu[3], quantity: 3 }],
    total: 12.0,
    status: "preparing",
    createdAt: "2026-02-18T11:15:00",
    estimatedTime: "15 min",
  },
  {
    id: "oo3",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [
      { menuItem: restaurants[0].menu[0], quantity: 1 },
      { menuItem: restaurants[0].menu[4], quantity: 2 },
    ],
    total: 12.5,
    status: "almost_ready",
    createdAt: "2026-02-18T10:45:00",
    estimatedTime: "5 min",
  },
  {
    id: "oo4",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [{ menuItem: restaurants[0].menu[1], quantity: 2 }],
    total: 13.0,
    status: "ready",
    createdAt: "2026-02-18T10:30:00",
    estimatedTime: "Ready",
  },
  {
    id: "oo5",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    items: [
      { menuItem: restaurants[0].menu[0], quantity: 1 },
      { menuItem: restaurants[0].menu[2], quantity: 1 },
    ],
    total: 12.5,
    status: "completed",
    createdAt: "2026-02-17T19:00:00",
    estimatedTime: "Done",
  },
];

// ─── Owner: Incoming Reservations ───────────────────────────────────────────

export const mockOwnerReservations: Reservation[] = [
  {
    id: "or1",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    date: "2026-02-18",
    time: "19:00",
    guests: 2,
    status: "confirmed",
    tableId: "t1",
    checkedIn: false,
    deposit: 10.0,
    preOrder: [{ menuItem: restaurants[0].menu[0], quantity: 2 }],
  },
  {
    id: "or2",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    date: "2026-02-19",
    time: "12:00",
    guests: 6,
    status: "pending",
    tableId: "t3",
  },
  {
    id: "or3",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    date: "2026-02-20",
    time: "18:30",
    guests: 4,
    status: "pending",
    tableId: "t2",
    deposit: 15.0,
    preOrder: [
      { menuItem: restaurants[0].menu[0], quantity: 1 },
      { menuItem: restaurants[0].menu[1], quantity: 2 },
    ],
  },
  {
    id: "or4",
    restaurantId: "1",
    restaurantName: "Malis Restaurant",
    restaurantImage: restaurant1,
    date: "2026-02-14",
    time: "19:00",
    guests: 2,
    status: "completed",
    tableId: "t4",
    checkedIn: true,
  },
];
