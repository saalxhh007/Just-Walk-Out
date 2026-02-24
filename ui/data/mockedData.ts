export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  entryTime: string;
  status: "in-store" | "checked-out" | "idle";
  currentCart?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: "active" | "pending" | "completed";
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  zone: string;
  status: "online" | "offline";
  streamUrl: string;
  lastChecked: string;
}

export interface Alert {
  id: string;
  type: "suspicious" | "misplaced" | "camera-offline";
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  read: boolean;
}

export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: "enter" | "pick" | "return" | "exit" | "checking-out" | "alert";
}

export const mockProducts: Product[] = [
  { id: "p1", name: "Organic Milk", price: 3.49, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop", category: "Dairy", stock: 45 },
  { id: "p2", name: "Sourdough Bread", price: 4.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop", category: "Bakery", stock: 22 },
  { id: "p3", name: "Fresh Orange Juice", price: 5.29, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=100&h=100&fit=crop", category: "Beverages", stock: 38 },
  { id: "p4", name: "Avocado", price: 1.99, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d80f74?w=100&h=100&fit=crop", category: "Produce", stock: 60 },
  { id: "p5", name: "Greek Yogurt", price: 2.79, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop", category: "Dairy", stock: 33 },
  { id: "p6", name: "Chicken Breast", price: 8.99, image: "https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=100&h=100&fit=crop", category: "Meat", stock: 15 },
  { id: "p7", name: "Pasta Fusilli", price: 2.19, image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=100&h=100&fit=crop", category: "Pantry", stock: 80 },
  { id: "p8", name: "Olive Oil", price: 7.49, image: "https://images.unsplash.com/photo-1474979266404-7eaacdc34f9a?w=100&h=100&fit=crop", category: "Pantry", stock: 27 },
];

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Ali Mansouri", email: "ali@mail.com", phone: "+212 600-1234", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", entryTime: "10:23 AM", status: "in-store", currentCart: "cart1" },
  { id: "c2", name: "Sara Benjelloun", email: "sara@mail.com", phone: "+212 600-5678", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop", entryTime: "10:45 AM", status: "in-store", currentCart: "cart2" },
  { id: "c3", name: "Karim El Fassi", email: "karim@mail.com", phone: "+212 600-9012", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", entryTime: "11:02 AM", status: "in-store", currentCart: "cart3" },
  { id: "c4", name: "Nadia Chaoui", email: "nadia@mail.com", phone: "+212 600-3456", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", entryTime: "09:15 AM", status: "checked-out" },
  { id: "c5", name: "Hassan Tazi", email: "hassan@mail.com", phone: "+212 600-7890", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", entryTime: "11:30 AM", status: "in-store", currentCart: "cart4" },
];

export const mockCarts: Cart[] = [
  { id: "cart1", customerId: "c1", customerName: "Ali Mansouri", items: [{ product: mockProducts[0], quantity: 2 }, { product: mockProducts[3], quantity: 3 }], total: 12.95, status: "active" },
  { id: "cart2", customerId: "c2", customerName: "Sara Benjelloun", items: [{ product: mockProducts[2], quantity: 1 }, { product: mockProducts[4], quantity: 2 }], total: 10.87, status: "active" },
  { id: "cart3", customerId: "c3", customerName: "Karim El Fassi", items: [{ product: mockProducts[1], quantity: 1 }, { product: mockProducts[6], quantity: 2 }, { product: mockProducts[7], quantity: 1 }], total: 16.86, status: "pending" },
  { id: "cart4", customerId: "c5", customerName: "Hassan Tazi", items: [{ product: mockProducts[5], quantity: 1 }], total: 8.99, status: "active" },
];

export const mockCameras: Camera[] = [
  { id: "cam1", name: "Entrance Main", location: "Front Door", zone: "Entrance", status: "online", streamUrl: "rtsp://192.168.1.10:554/stream", lastChecked: "2 min ago" },
  { id: "cam2", name: "Aisle 1 - Dairy", location: "Aisle 1", zone: "Dairy Section", status: "online", streamUrl: "rtsp://192.168.1.11:554/stream", lastChecked: "1 min ago" },
  { id: "cam3", name: "Aisle 2 - Bakery", location: "Aisle 2", zone: "Bakery Section", status: "offline", streamUrl: "rtsp://192.168.1.12:554/stream", lastChecked: "15 min ago" },
  { id: "cam4", name: "Checkout Area", location: "Checkout", zone: "Registers", status: "online", streamUrl: "rtsp://192.168.1.13:554/stream", lastChecked: "30 sec ago" },
  { id: "cam5", name: "Storage Room", location: "Back", zone: "Storage", status: "online", streamUrl: "rtsp://192.168.1.14:554/stream", lastChecked: "5 min ago" },
];

export const mockAlerts: Alert[] = [
  { id: "a1", type: "suspicious", message: "Unusual loitering detected near electronics shelf", timestamp: "11:45 AM", severity: "high", read: false },
  { id: "a2", type: "misplaced", message: "Milk bottle detected on bread shelf (Aisle 2)", timestamp: "11:30 AM", severity: "medium", read: false },
  { id: "a3", type: "camera-offline", message: "Camera 'Aisle 2 - Bakery' went offline", timestamp: "11:15 AM", severity: "high", read: true },
  { id: "a4", type: "suspicious", message: "Multiple items concealed in bag without scanning", timestamp: "10:50 AM", severity: "high", read: false },
  { id: "a5", type: "misplaced", message: "Yogurt found in produce section", timestamp: "10:20 AM", severity: "low", read: true },
];

export const mockActivity: ActivityEvent[] = [
  { id: "ev1", message: "Ali picked Organic Milk (×2)", timestamp: "11:42 AM", type: "pick" },
  { id: "ev2", message: "Sara returned Fresh Orange Juice", timestamp: "11:38 AM", type: "return" },
  { id: "ev3", message: "Hassan entered the store", timestamp: "11:30 AM", type: "enter" },
  { id: "ev4", message: "Karim picked Olive Oil", timestamp: "11:25 AM", type: "pick" },
  { id: "ev5", message: "Nadia checked out — $24.50", timestamp: "11:10 AM", type: "exit" },
  { id: "ev6", message: "Suspicious activity near Aisle 3", timestamp: "10:55 AM", type: "alert" },
  { id: "ev7", message: "Ali picked Avocado (×3)", timestamp: "10:48 AM", type: "pick" },
  { id: "ev8", message: "Sara entered the store", timestamp: "10:45 AM", type: "enter" },
];

export const salesData = [
  { day: "Mon", sales: 1240 },
  { day: "Tue", sales: 1890 },
  { day: "Wed", sales: 1560 },
  { day: "Thu", sales: 2100 },
  { day: "Fri", sales: 2450 },
  { day: "Sat", sales: 3200 },
  { day: "Sun", sales: 1800 },
];

export const topProducts = [
  { name: "Organic Milk", picks: 145 },
  { name: "Avocado", picks: 132 },
  { name: "Sourdough Bread", picks: 98 },
  { name: "Greek Yogurt", picks: 87 },
  { name: "Orange Juice", picks: 76 },
];

export const peakHoursData = [
  { hour: "8AM", visitors: 12 },
  { hour: "9AM", visitors: 25 },
  { hour: "10AM", visitors: 45 },
  { hour: "11AM", visitors: 62 },
  { hour: "12PM", visitors: 78 },
  { hour: "1PM", visitors: 55 },
  { hour: "2PM", visitors: 42 },
  { hour: "3PM", visitors: 38 },
  { hour: "4PM", visitors: 50 },
  { hour: "5PM", visitors: 65 },
  { hour: "6PM", visitors: 72 },
  { hour: "7PM", visitors: 48 },
  { hour: "8PM", visitors: 20 },
];
