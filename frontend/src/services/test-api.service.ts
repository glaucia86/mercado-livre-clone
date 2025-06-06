import { api } from './api.service'

async function testApi() {
  console.log('🧪 Testando API Service...\n')
  
  try {
    // Teste 1: Health check
    console.log('🔍 Teste 1: Health Check')
    const health = await api.healthCheck()
    console.log('Resultado:', health)
    
    // Teste 2: Listar produtos
    console.log('\n🔍 Teste 2: Listar Produtos')
    const products = await api.getProducts({ limit: 3 })
    console.log(`Resultado: ${products.items.length} produtos de ${products.total}`)
    
    // Teste 3: Buscar por categoria
    console.log('\n🔍 Teste 3: Buscar Smartphones')
    const smartphones = await api.getProducts({ category: 'smartphones' })
    console.log(`Resultado: ${smartphones.items.length} smartphones`)
    
    // Teste 4: Produto específico
    console.log('\n🔍 Teste 4: Produto ML-001')
    const product = await api.getProduct('ML-001')
    console.log(`Resultado: ${product.title}`)
    
    // Teste 5: Categorias
    console.log('\n🔍 Teste 5: Categorias')
    const categories = await api.getCategories()
    console.log(`Resultado: ${categories.join(', ')}`)
    
    console.log('\n✅ Todos os testes da API passaram!')
    
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error)
  }
}

// Para testar no browser console
if (typeof window !== 'undefined') {
  (window as any).testApi = testApi
}