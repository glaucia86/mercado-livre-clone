'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, PaginatedResponse, ProductFilters, LoadingState } from '@/types'
import { api } from '@/services/api.service'
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard'
import Filters from '@/components/Filters'
import { useSearchDebounce } from '@/hooks/useDebounce'

// ============================================================================
// HOME PAGE COMPONENT - Página principal com lista de produtos
// ============================================================================

export default function HomePage() {
  // Estados da página
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  
  // Separar estado local de busca dos filtros para evitar re-renders
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<ProductFilters>({})
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  })
  const [sortBy, setSortBy] = useState<string>('relevance')

  // Aplicar debounce na busca (800ms)
  const debouncedSearchTerm = useSearchDebounce(searchTerm, 800)

  // ============================================================================
  // EFFECTS PARA SINCRONIZAR BUSCA COM FILTROS
  // ============================================================================

  // Atualizar filtros quando o termo de busca com debounce mudar
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: debouncedSearchTerm || undefined
    }))
  }, [debouncedSearchTerm])

  // Sincronizar searchTerm com filtros quando filters.search mudar externamente
  useEffect(() => {
    if (filters.search !== searchTerm) {
      setSearchTerm(filters.search || '')
    }
  }, [filters.search])

  // ============================================================================
  // FUNÇÃO PARA CARREGAR PRODUTOS
  // ============================================================================

  const loadProducts = useCallback(async (
    currentFilters: ProductFilters = filters,
    currentPage: number = 1,
    resetList: boolean = false
  ) => {
    try {
      setLoadingState({ isLoading: true, error: null })
      
      console.log('🔍 Carregando produtos:', { currentFilters, currentPage })

      const response: PaginatedResponse<Product> = await api.getProducts({
        ...currentFilters,
        page: currentPage,
        limit: pagination.limit
      })

      // Se é uma nova busca (página 1), substitui a lista
      // Se é paginação, adiciona à lista existente
      if (resetList || currentPage === 1) {
        setProducts(response.items)
      } else {
        setProducts(prev => [...prev, ...response.items])
      }

      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      })

      console.log('✅ Produtos carregados:', response)

    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
      setLoadingState({ 
        isLoading: false, 
        error: 'Erro ao carregar produtos. Tente novamente.' 
      })
      return
    }

    setLoadingState({ isLoading: false, error: null })
  }, [filters, pagination.limit])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Carregar produtos quando a página carrega
  useEffect(() => {
    loadProducts({}, 1, true)
  }, [])

  // Carregar produtos quando filtros mudam (mas não a cada tecla da busca)
  useEffect(() => {
    // Só recarrega se há filtros aplicados ou se a busca foi limpa
    const hasActiveFilters = Object.keys(filters).some(key => {
      const value = filters[key as keyof ProductFilters]
      return value !== undefined && value !== null && value !== ''
    })

    if (hasActiveFilters) {
      console.log('🔄 Recarregando produtos com filtros:', filters)
      loadProducts(filters, 1, true)
    }
  }, [filters]) // Agora só depende de filters, não de searchTerm

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFiltersChange = (newFilters: ProductFilters) => {
    console.log('🔧 Filtros alterados:', newFilters)
    
    // Se a busca mudou, atualizar o estado local imediatamente (sem debounce)
    // Isso permite que o usuário veja o que está digitando
    if (newFilters.search !== undefined && newFilters.search !== searchTerm) {
      setSearchTerm(newFilters.search)
    }
    
    // Para outros filtros (categoria, preço, etc.), aplicar imediatamente
    const { search, ...otherFilters } = newFilters
    setFilters(prevFilters => ({
      ...prevFilters,
      ...otherFilters,
      // Manter a busca atual do estado local, não da prop
      search: prevFilters.search
    }))
  }

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loadingState.isLoading) {
      loadProducts(filters, pagination.page + 1, false)
    }
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    // TODO: Implementar ordenação na API
    console.log('🔄 Ordenação alterada:', newSortBy)
  }

  const handleRetry = () => {
    loadProducts(filters, 1, true)
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================================================================
          HERO SECTION (opcional)
          ================================================================ */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container-ml">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Encontre tudo o que você precisa
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Milhares de produtos com os melhores preços e frete grátis. 
              Smartphones, notebooks, games e muito mais!
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          MAIN CONTENT
          ================================================================ */}
      <div className="container-ml py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================================================================
              SIDEBAR - Filtros (Desktop) e Modal (Mobile)
              ================================================================ */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Filters
                filters={{ ...filters, search: searchTerm }} // Passar searchTerm atual
                onFiltersChange={handleFiltersChange}
                resultsCount={pagination.total}
                isLoading={loadingState.isLoading}
              />
            </div>
          </aside>

          {/* ================================================================
              CONTENT AREA - Produtos
              ================================================================ */}
          <main className="flex-1">
            
            {/* ============================================================
                HEADER DA LISTAGEM
                ============================================================ */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              
              {/* Breadcrumb */}
              <nav className="breadcrumb">
                <a href="/" className="breadcrumb-item">Início</a>
                <span className="breadcrumb-separator">›</span>
                {filters.category ? (
                  <>
                    <span className="breadcrumb-item capitalize">{filters.category}</span>
                    <span className="breadcrumb-separator">›</span>
                  </>
                ) : null}
                <span className="text-gray-900">Produtos</span>
              </nav>

              {/* Ordenação */}
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loadingState.isLoading}
                >
                  <option value="relevance">Mais relevantes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="rating">Melhor avaliados</option>
                  <option value="reviews">Mais vendidos</option>
                </select>
              </div>
            </div>

            {/* ============================================================
                ESTADO DE ERRO
                ============================================================ */}
            {loadingState.error && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ops! Algo deu errado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {loadingState.error}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="btn-primary"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================
                GRID DE PRODUTOS
                ============================================================ */}
            {!loadingState.error && (
              <>
                {/* Loading inicial */}
                {loadingState.isLoading && products.length === 0 && (
                  <div className="products-grid">
                    {[...Array(12)].map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                  </div>
                )}

                {/* Produtos carregados */}
                {products.length > 0 && (
                  <>
                    <div className="products-grid">
                      {products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          priority={index < 4} // Otimização: primeiros 4 produtos têm prioridade
                        />
                      ))}
                    </div>

                    {/* ====================================================
                        PAGINAÇÃO / LOAD MORE
                        ==================================================== */}
                    <div className="mt-12 text-center">
                      {pagination.page < pagination.totalPages ? (
                        <button
                          onClick={handleLoadMore}
                          disabled={loadingState.isLoading}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingState.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Carregando...</span>
                            </div>
                          ) : (
                            `Carregar mais produtos (${pagination.page}/${pagination.totalPages})`
                          )}
                        </button>
                      ) : products.length > 0 ? (
                        <div className="text-gray-600">
                          <p>Você viu todos os {pagination.total} produtos disponíveis</p>
                        </div>
                      ) : null}
                    </div>
                  </>
                )}

                {/* Estado vazio (sem produtos encontrados) */}
                {!loadingState.isLoading && products.length === 0 && !loadingState.error && (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum produto encontrado
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Tente ajustar os filtros ou buscar por outros termos.
                      </p>
                      <button
                        onClick={() => handleFiltersChange({})}
                        className="btn-secondary"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ================================================================
          SEÇÃO DE CATEGORIAS EM DESTAQUE (opcional)
          ================================================================ */}
      <section className="bg-white py-16 mt-16">
        <div className="container-ml">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Categorias em destaque
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Smartphones', icon: '📱', category: 'smartphones' },
              { name: 'Notebooks', icon: '💻', category: 'notebooks' },
              { name: 'Games', icon: '🎮', category: 'games' },
              { name: 'TV & Casa', icon: '📺', category: 'eletronicos' },
              { name: 'Moda', icon: '👕', category: 'moda' },
              { name: 'Esportes', icon: '⚽', category: 'esportes' }
            ].map((cat) => (
              <button
                key={cat.category}
                onClick={() => handleFiltersChange({ category: cat.category })}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}