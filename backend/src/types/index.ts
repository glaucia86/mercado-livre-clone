// ============================================================================
// MAIN INTERFACES - Application data contracts
// ============================================================================

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  category: string;
  seller: Seller;
  rating: number;
  reviews: number;
  shipping: {
    free: boolean;
    cost?: number;
  }
  stock: number;
  discount?: {
    percentage: number;
    amount: number;
  }
}

export interface Seller {
  id: string;
  name: string;
  reputation: number;
  location: string;
}

// ============================================================================
// FILTER AND SEARCH INTERFACES
// ============================================================================
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  freeShipping?: boolean;
  search?: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
