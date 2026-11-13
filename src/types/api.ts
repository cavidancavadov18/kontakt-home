export type User = {
  id: string;
  phone: string;
  name: string;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  userId: string | null;
  phone: string;
  createdAt: string;
  locale: "az" | "ru";
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    note: string;
  };
  payment: {
    method: "cash" | "card" | "installment";
    installmentMonths?: number;
    status: "paid" | "pending";
    transactionId?: string;
  };
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode: string | null;
  stockReserved: boolean;
};

export type Review = {
  id: string;
  slug: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Address = {
  id: string;
  userId: string;
  label: string;
  city: string;
  line: string;
  isDefault: boolean;
  createdAt: string;
};

export type Ticket = {
  id: string;
  message: string;
  phone: string | null;
  userId: string | null;
  createdAt: string;
  status: "open" | "closed";
};

export type OneClickRecord = {
  id: string;
  name: string;
  phone: string;
  productId: string;
  slug: string;
  productName: string;
  createdAt: string;
};

export type StockEntry = {
  productId: string;
  qty: number;
  reserved: number;
};

export type PromoValidation =
  | {
      valid: true;
      code: string;
      discount: number;
      deliveryFee: number;
      grandTotal: number;
      qualifiesFreeDelivery: boolean;
    }
  | { valid: false; code: string | null; error: string };
