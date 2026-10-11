export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  products: Product[];
};

export type MenuData = {
  storeName: string;
  logo: string;
  primaryColor: string;
  categories: Category[];
};

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export type OrderStatus = "pending_payment" | "paid" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  _id?: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  fulfillment: "pickup" | "delivery";
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
};
