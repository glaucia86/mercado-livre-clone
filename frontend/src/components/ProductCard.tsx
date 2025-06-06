import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { formatPrice, generateStars } from '@/services/api.service'

// ============================================================================
// PRODUCT CARD COMPONENT - Card para exibição na lista de produtos
// ============================================================================

interface ProductCardProps {
  product: Product
  priority?: boolean // Para otimização de loading de imagens
  className?: string
}

export default function ProductCard({ 
  product, 
  priority = false, 
  className = '' 
}: ProductCardProps) {
  // Calcular desconto se existir preço original
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  return (
    <article className={`product-card hover-lift group ${className}`}>
      <Link href={`/products/${product.id}`} className="block">
        {/* ================================================================
            CONTAINER DE IMAGEM
            ================================================================ */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {/* Badge de desconto */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Badge de frete grátis */}
          {product.shipping.free && (
            <div className="absolute top-2 right-2 z-10">
              <span className="free-shipping-badge">
                Frete grátis
              </span>
            </div>
          )}

          {/* Imagem do produto */}
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback para imagem não encontrada
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-product.jpg'
            }}
          />

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        {/* ================================================================
            INFORMAÇÕES DO PRODUTO
            ================================================================ */}
        <div className="p-4 space-y-3">
          {/* Título */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>

          {/* Preços */}
          <div className="space-y-1">
            {hasDiscount && (
              <p className="price-original">
                {formatPrice(product.originalPrice!)}
              </p>
            )}
            <p className="price-highlight">
              {formatPrice(product.price)}
            </p>
            {hasDiscount && product.discount && (
              <p className="text-xs text-green-600 font-medium">
                Economia de {formatPrice(product.discount.amount)}
              </p>
            )}
          </div>

          {/* Rating e avaliações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rating-stars">
                {generateStars(product.rating).map((star: string, index: number) => (
                  <span key={index} className="text-sm">
                    {star}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews.toLocaleString('pt-BR')})
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Informações do vendedor */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="font-medium text-gray-700">
                {product.seller.name}
              </span>
              <div className="flex items-center">
                <span className="text-green-600">
                  {product.seller.reputation}%
                </span>
                <svg className="w-3 h-3 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <span>
              {product.seller.location}
            </span>
          </div>

          {/* Estoque baixo warning */}
          {product.stock <= 10 && product.stock > 0 && (
            <div className="flex items-center space-x-1 text-xs text-orange-600">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Últimas {product.stock} unidades!</span>
            </div>
          )}

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="text-center py-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Fora de estoque
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ================================================================
          AÇÕES RÁPIDAS (hover)
          ================================================================ */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-white border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-0">
        <div className="flex space-x-2">
          <button 
            className="flex-1 btn-primary text-sm py-2"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault()
              handleQuickBuy(product)
            }}
          >
            {product.stock === 0 ? 'Indisponível' : 'Comprar agora'}
          </button>
          <button 
            className="btn-secondary p-2"
            onClick={(e) => {
              e.preventDefault()
              handleAddToFavorites(product)
            }}
            aria-label="Adicionar aos favoritos"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ============================================================================
// SKELETON LOADING COMPONENT - Para loading states
// ============================================================================

export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      {/* Imagem skeleton */}
      <div className="aspect-square bg-gray-200 rounded-t-lg" />
      
      {/* Conteúdo skeleton */}
      <div className="p-4 space-y-3">
        {/* Título */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        
        {/* Preço */}
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
        
        {/* Vendedor */}
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HELPER FUNCTIONS - Funções auxiliares para ações
// ============================================================================

async function handleQuickBuy(product: Product) {
  // Simular ação de compra rápida
  console.log('🛒 Compra rápida:', product.title)
  
  // Aqui você implementaria:
  // - Adicionar ao carrinho
  // - Redirect para checkout
  // - Mostrar modal de confirmação
  
  // Por enquanto, vamos mostrar um alert
  alert(`Produto "${product.title}" adicionado ao carrinho!`)
}

async function handleAddToFavorites(product: Product) {
  // Simular ação de favoritar
  console.log('❤️ Favoritar:', product.title)
  
  // Aqui você implementaria:
  // - Salvar no localStorage
  // - Enviar para API de favoritos
  // - Atualizar estado global
  
  // Por enquanto, vamos mostrar um alert
  alert(`Produto "${product.title}" adicionado aos favoritos!`)
}