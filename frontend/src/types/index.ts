// ============================================================================
// TYPES - Tipos compartilhados entre Frontend e Backend
// ============================================================================

export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number        // Para mostrar desconto
  currency: string
  image: string
  category: string
  seller: Seller
  rating: number
  reviews: number
  shipping: {
    free: boolean
    cost?: number
  }
  stock: number
  discount?: {                  // Para mostrar desconto aplicado
    percentage: number
    amount: number
  }
}

export interface Seller {
  id: string
  name: string
  reputation: number
  location: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================================
// TYPES ESPECÍFICOS DO FRONTEND
// ============================================================================

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  freeShipping?: boolean
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}