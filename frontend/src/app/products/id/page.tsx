'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { api, formatPrice, generateStars } from '@/services/api.service'

// ============================================================================
// PRODUCT DETAIL PAGE - Página de detalhes do produto
// ============================================================================

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // ============================================================================
  // CARREGAR DADOS DO PRODUTO
  // ============================================================================

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔍 Carregando produto:', params.id)
        
        const productData = await api.getProduct(params.id)
        setProduct(productData)
        
        console.log('✅ Produto carregado:', productData)
        
      } catch (error) {
        console.error('❌ Erro ao carregar produto:', error)
        setError('Produto não encontrado')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    
    try {
      // Simular adição ao carrinho
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('🛒 Produto adicionado ao carrinho:', {
        product: product.title,
        quantity
      })

      // Aqui você implementaria:
      // - Salvar no localStorage
      // - Enviar para API do carrinho
      // - Atualizar estado global
      
      alert(`${quantity}x "${product.title}" adicionado ao carrinho!`)
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar ao carrinho. Tente novamente.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    console.log('💳 Comprar agora:', {
      product: product.title,
      quantity
    })

    // Aqui você implementaria:
    // - Redirect para checkout
    // - Salvar dados da compra
    
    alert(`Redirecionando para checkout de ${quantity}x "${product.title}"`)
  }

  // ============================================================================
  // ESTADOS DE LOADING E ERROR
  // ============================================================================

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produto não encontrado
          </h1>
          <p className="text-gray-600 mb-4">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link href="/" className="btn-primary">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    )
  }

  // Calcular desconto
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================================================================
          BREADCRUMB
          ================================================================ */}
      <div className="bg-white border-b">
        <div className="container-ml py-4">
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb-item">Início</Link>
            <span className="breadcrumb-separator">›</span>
            <Link href={`/?category=${product.category}`} className="breadcrumb-item capitalize">
              {product.category}
            </Link>
            <span className="breadcrumb-separator">›</span>
            <span className="text-gray-900 line-clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* ================================================================
          CONTEÚDO PRINCIPAL
          ================================================================ */}
      <div className="container-ml py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ================================================================
              GALERIA DE IMAGENS
              ================================================================ */}
          <div className="space-y-4">
            {/* Imagem principal */}
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                width={600}
                height={600}
                priority
                className="w-full h-full object-contain p-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-product.jpg'
                }}
              />
            </div>

            {/* Thumbnails (simulando galeria) */}
            <div className="flex space-x-2 overflow-x-auto">
              {[product.image, product.image, product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - Imagem ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================================================================
              INFORMAÇÕES DO PRODUTO
              ================================================================ */}
          <div className="space-y-6">
            
            {/* Título e badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {hasDiscount && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                    -{discountPercentage}% OFF
                  </span>
                )}
                {product.shipping.free && (
                  <span className="free-shipping-badge">
                    Frete grátis
                  </span>
                )}
                {product.stock <= 10 && product.stock > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Últimas {product.stock} unidades
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating e avaliações */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="rating-stars">
                  {generateStars(product.rating).map((star, index) => (
                    <span key={index} className="text-lg">
                      {star}
                    </span>
                  ))}
                </div>
                <span className="font-medium text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews.toLocaleString('pt-BR')} avaliações)
              </span>
            </div>

            {/* Preços */}
            <div className="space-y-2">
              {hasDiscount && (
                <p className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice!)}
                </p>
              )}
              <p className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
              {hasDiscount && product.discount && (
                <p className="text-lg text-green-600 font-medium">
                  Você economiza {formatPrice(product.discount.amount)}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Em até 12x de {formatPrice(product.price / 12)} sem juros
              </p>
            </div>

            {/* Quantidade e ações */}
            <div className="space-y-4">
              {/* Seletor de quantidade */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantidade:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.stock} disponíveis)
                </span>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Produto indisponível' : 'Comprar agora'}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="w-full btn-secondary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Adicionando...</span>
                    </div>
                  ) : (
                    'Adicionar ao carrinho'
                  )}
                </button>
              </div>
            </div>

            {/* Informações do vendedor */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Vendido por</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-600">
                    {product.seller.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.seller.location}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-green-600">
                    {product.seller.reputation}%
                  </span>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-500">
                    Vendedor confiável
                  </span>
                </div>
              </div>
            </div>

            {/* Informações de entrega */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                </svg>
                Entrega
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-medium text-green-600">
                    {product.shipping.free ? 'Grátis' : `R$ ${product.shipping.cost}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo:</span>
                  <span className="font-medium">2-5 dias úteis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retirada:</span>
                  <span className="font-medium">Disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            DESCRIÇÃO E ESPECIFICAÇÕES
            ================================================================ */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Descrição */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Descrição do produto
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          {/* Especificações simuladas */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Especificações
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Categoria:</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">
                  {product.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Código:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Garantia:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  12 meses
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Origem:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  Nacional
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SKELETON LOADING COMPONENT
// ============================================================================

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b">
        <div className="container-ml py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <span>›</span>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <span>›</span>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-ml py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}