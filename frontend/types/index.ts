// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript Interfaces — Product Catalog
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductRatings {
  average: number;
  count: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: { _id: string; name: string; slug: string } | string;
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  weight: string;
  stock: number;
  images: string[];
  ratings: ProductRatings;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
}

export interface Order {
  _id: string;
  orderId: string;
  items: Array<{
    product: Product;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    mobile: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  itemsTotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  avatar?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination Meta — matches the backend PaginationMeta interface exactly
// ─────────────────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Response Envelope — products list
// ─────────────────────────────────────────────────────────────────────────────
export interface ProductsApiResponse {
  status: 'success' | 'error';
  meta: PaginationMeta;
  data: Product[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}
