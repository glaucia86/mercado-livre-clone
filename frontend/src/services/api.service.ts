import { Product, PaginatedResponse, ApiResponse } from '../types'

// ============================================================================
// API SERVICE - Comunicação com Backend
// ============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiService {
  // ==========================================================================
  // MÉTODO PRIVADO: Request genérico com tratamento de erro
  // ==========================================================================
  
  private async request<T>(endpoint: string): Promise<T> {
    try {
      console.log(`🌐 API Request: ${API_BASE}${endpoint}`)
      
      const response = await fetch(`${API_BASE}${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }
      
      const result: ApiResponse<T> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'API request failed')
      }
      
      console.log(`✅ API Response: ${endpoint}`, result.data)
      return result.data
      
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error)
      throw error
    }
  }

  // ==========================================================================
  // MÉTODO PÚBLICO: Buscar produtos com filtros
  // ==========================================================================
  
  async getProducts(params: {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    freeShipping?: boolean
    page?: number
    limit?: number
  } = {}): Promise<PaginatedResponse<Product>> {
    
    console.log('🌐 API getProducts chamada com params:', params)
    
    // Criar query string
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        console.log(`📎 Adicionando param ${key}:`, value)
        searchParams.append(key, value.toString())
      } else {
        console.log(`⏭️ Ignorando param ${key}:`, value)
      }
    })
    
    const query = searchParams.toString()
    const endpoint = `/products${query ? `?${query}` : ''}`
    
    console.log('🔗 URL final:', `${API_BASE}${endpoint}`)
    
    return this.request<PaginatedResponse<Product>>(endpoint)
  }

  // ==========================================================================
  // MÉTODO PÚBLICO: Buscar produto específico
  // ==========================================================================
  
  async getProduct(id: string): Promise<Product> {
    if (!id) {
      throw new Error('Product ID is required')
    }
    
    return this.request<Product>(`/products/${id}`)
  }

  // ==========================================================================
  // MÉTODO PÚBLICO: Buscar categorias
  // ==========================================================================
  
  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/products/categories')
  }

  // ==========================================================================
  // MÉTODO PÚBLICO: Aplicar desconto (para live coding)
  // ==========================================================================
  
  async applyDiscount(productId: string, percentage: number): Promise<Product> {
    try {
      console.log(`🌐 API Request: POST ${API_BASE}/products/${productId}/discount`)
      
      const response = await fetch(`${API_BASE}/products/${productId}/discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ percentage })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      
      const result: ApiResponse<Product> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to apply discount')
      }
      
      console.log(`✅ Discount applied: ${percentage}%`, result.data)
      return result.data
      
    } catch (error) {
      console.error(`❌ Error applying discount:`, error)
      throw error
    }
  }

  // ==========================================================================
  // MÉTODO PÚBLICO: Health check da API
  // ==========================================================================
  
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE}/health`)
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error('❌ Health check failed:', error)
      throw error
    }
  }
}

// Exporta instância única (Singleton)
export const api = new ApiService()

// =============================================================================
// HELPER FUNCTIONS - Funções utilitárias
// =============================================================================

// Formatar preço brasileiro
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

// Gerar estrelas de rating
export function generateStars(rating: number): string[] {
  return Array.from({ length: 5 }, (_, i) => 
    i < Math.floor(rating) ? '★' : '☆'
  )
}

// Calcular desconto
export function calculateDiscount(originalPrice: number, finalPrice: number) {
  const difference = originalPrice - finalPrice
  const percentage = (difference / originalPrice) * 100
  
  return {
    amount: difference,
    percentage: Math.round(percentage)
  }
}