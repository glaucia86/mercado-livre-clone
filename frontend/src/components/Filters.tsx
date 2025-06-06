import { useState, useEffect } from 'react'
import { ProductFilters } from '@/types'
import { api } from '@/services/api.service'
import { useDebounce } from '@/hooks/useDebounce'

// ============================================================================
// FILTERS COMPONENT - Componente de filtros para produtos
// ============================================================================

interface FiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onSearchChange?: (searchTerm: string) => void // Nova prop para busca
  resultsCount?: number
  isLoading?: boolean
}

export default function Filters({ 
  filters, 
  onFiltersChange,
  onSearchChange,
  resultsCount = 0,
  isLoading = false 
}: FiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  // Estados locais para preços (evitar perda de foco)
  const [localMinPrice, setLocalMinPrice] = useState<string>('')
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('')

  // Aplicar debounce nos preços (1 segundo para dar tempo de digitar)
  const debouncedMinPrice = useDebounce(localMinPrice, 1000)
  const debouncedMaxPrice = useDebounce(localMaxPrice, 1000)

  // Carregar categorias ao montar o componente
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true)
        const categoriesData = await api.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Sincronizar preços locais com filtros quando filters mudam externamente
  useEffect(() => {
    setLocalMinPrice(filters.minPrice?.toString() || '')
    setLocalMaxPrice(filters.maxPrice?.toString() || '')
  }, [filters.minPrice, filters.maxPrice])

  // Atualizar filtros quando preços com debounce mudarem
  useEffect(() => {
    const minPrice = debouncedMinPrice ? Number(debouncedMinPrice) : undefined
    const maxPrice = debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined
    
    // Só atualizar se realmente mudou
    if (filters.minPrice !== minPrice || filters.maxPrice !== maxPrice) {
      console.log('💰 Atualizando preços com debounce:', { minPrice, maxPrice })
      
      // Atualizar filtros diretamente sem passar por updateFilter para evitar loop
      const newFilters = { ...filters }
      
      if (minPrice !== undefined) {
        newFilters.minPrice = minPrice
      } else {
        delete newFilters.minPrice
      }
      
      if (maxPrice !== undefined) {
        newFilters.maxPrice = maxPrice
      } else {
        delete newFilters.maxPrice
      }
      
      onFiltersChange(newFilters)
    }
  }, [debouncedMinPrice, debouncedMaxPrice])

  // Atualizar filtros
  const updateFilter = (key: keyof ProductFilters, value: any) => {
    console.log(`🔧 Atualizando filtro ${key}:`, value)
    
    const newFilters = { ...filters, [key]: value }
    
    // Remover campos vazios/undefined
    Object.keys(newFilters).forEach(k => {
      const val = newFilters[k as keyof ProductFilters]
      if (val === '' || val === undefined || val === null) {
        console.log(`🗑️ Removendo filtro ${k}:`, val)
        delete newFilters[k as keyof ProductFilters]
      }
    })
    
    console.log('📦 Novos filtros:', newFilters)
    
    // Se estamos limpando preços, limpar também os estados locais
    if (key === 'minPrice' && (value === undefined || value === null)) {
      setLocalMinPrice('')
    }
    if (key === 'maxPrice' && (value === undefined || value === null)) {
      setLocalMaxPrice('')
    }
    
    onFiltersChange(newFilters)
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    // Limpar busca se temos a função
    if (onSearchChange) {
      onSearchChange('')
    }
    // Limpar preços locais
    setLocalMinPrice('')
    setLocalMaxPrice('')
    // Limpar todos os filtros
    onFiltersChange({})
  }

  // Contar filtros ativos
  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof ProductFilters]
    return value !== undefined && value !== null && value !== ''
  }).length

  return (
    <div className="space-y-6">
      {/* ================================================================
          HEADER DOS FILTROS
          ================================================================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Filtros
          </h2>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {/* Botão mobile para expandir/recolher */}
        <button
          className="md:hidden btn-secondary text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Recolher' : 'Expandir'}
        </button>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-gray-600">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Buscando produtos...</span>
          </div>
        ) : (
          <span>
            {resultsCount.toLocaleString('pt-BR')} produto{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ================================================================
          CONTAINER DOS FILTROS (Responsivo)
          ================================================================ */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        
        {/* ================================================================
            BUSCA POR TEXTO
            ================================================================ */}
        <div className="filters-sidebar">
          <h3 className="font-medium text-gray-900 mb-3">Buscar</h3>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => {
                const newSearchValue = e.target.value
                // Se temos onSearchChange, usar ela (com debounce no pai)
                if (onSearchChange) {
                  onSearchChange(newSearchValue)
                } else {
                  // Fallback para o método antigo
                  updateFilter('search', newSearchValue)
                }
              }}
              placeholder="Digite o que você procura..."
              className="search-input"
              disabled={isLoading}
            />
            {filters.search && (
              <button
                onClick={() => {
                  // Limpar busca - atualizar ambos os estados
                  if (onSearchChange) {
                    onSearchChange('') // Limpa o estado local
                  }
                  updateFilter('search', '') // Limpa dos filtros
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpar busca"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ================================================================
            FILTRO POR CATEGORIA
            ================================================================ */}
        <div className="filters-sidebar">
          <h3 className="font-medium text-gray-900 mb-3">Categoria</h3>
          
          {categoriesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Opção "Todas as categorias" */}
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => updateFilter('category', undefined)} // Remove completamente
                  className="text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                  Todas as categorias
                </span>
              </label>

              {/* Categorias disponíveis */}
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => updateFilter('category', category)}
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200 capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================
            FILTRO POR PREÇO
            ================================================================ */}
        <div className="filters-sidebar">
          <h3 className="font-medium text-gray-900 mb-3">Preço</h3>
          
          <div className="space-y-3">
            {/* Preço mínimo */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Preço mínimo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  R$
                </span>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Preço máximo */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Preço máximo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  R$
                </span>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="999999"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Faixas de preço rápidas */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 mb-2">Faixas populares:</p>
              {[
                { label: 'Até R$ 500', max: 500 },
                { label: 'R$ 500 - R$ 1.000', min: 500, max: 1000 },
                { label: 'R$ 1.000 - R$ 5.000', min: 1000, max: 5000 },
                { label: 'R$ 5.000 - R$ 10.000', min: 5000, max: 10000 },
                { label: 'Acima de R$ 10.000', min: 10000 }
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    // Atualizar estados locais imediatamente (sem esperar debounce)
                    setLocalMinPrice(range.min?.toString() || '')
                    setLocalMaxPrice(range.max?.toString() || '')
                    // Atualizar filtros imediatamente para faixas pré-definidas
                    updateFilter('minPrice', range.min)
                    updateFilter('maxPrice', range.max)
                  }}
                  className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200"
                  disabled={isLoading}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            FILTROS ADICIONAIS
            ================================================================ */}
        <div className="filters-sidebar">
          <h3 className="font-medium text-gray-900 mb-3">Entrega</h3>
          
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.freeShipping || false}
              onChange={(e) => updateFilter('freeShipping', e.target.checked || undefined)}
              className="text-blue-600 focus:ring-blue-500 rounded"
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                Frete grátis
              </span>
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
              </svg>
            </div>
          </label>
        </div>

        {/* ================================================================
            AÇÕES DOS FILTROS
            ================================================================ */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="w-full btn-secondary text-sm"
              disabled={isLoading}
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* ================================================================
          FILTROS APLICADOS (Tags)
          ================================================================ */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <FilterTag
              label={`Busca: "${filters.search}"`}
              onRemove={() => {
                // Limpar busca - atualizar ambos os estados
                if (onSearchChange) {
                  onSearchChange('') // Limpa o estado local
                }
                updateFilter('search', '') // Limpa dos filtros
              }}
            />
          )}
          {filters.category && (
            <FilterTag
              label={`Categoria: ${filters.category}`}
              onRemove={() => updateFilter('category', '')}
            />
          )}
          {filters.minPrice && (
            <FilterTag
              label={`Min: R$ ${filters.minPrice}`}
              onRemove={() => {
                setLocalMinPrice('')
                updateFilter('minPrice', undefined)
              }}
            />
          )}
          {filters.maxPrice && (
            <FilterTag
              label={`Max: R$ ${filters.maxPrice}`}
              onRemove={() => {
                setLocalMaxPrice('')
                updateFilter('maxPrice', undefined)
              }}
            />
          )}
          {filters.freeShipping && (
            <FilterTag
              label="Frete grátis"
              onRemove={() => updateFilter('freeShipping', undefined)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// FILTER TAG COMPONENT - Tag para filtro aplicado
// ============================================================================

interface FilterTagProps {
  label: string
  onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:text-blue-900 transition-colors duration-200"
        aria-label={`Remover filtro: ${label}`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}