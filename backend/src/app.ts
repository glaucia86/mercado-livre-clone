import express from 'express'
import cors from 'cors'
import productRoutes from './routes/products.routes'
import { errorHandler, notFound, requestLogger } from './middleware/error.js'

// ============================================================================
// EXPRESS APPLICATION SETUP
// ============================================================================

const app = express()
const PORT = process.env.PORT || 3001

// ============================================================================
// GLOBAL MIDDLEWARE
// ============================================================================

// CORS - Allows requests from the frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URLs
  credentials: true
}))

// JSON parser for requests
app.use(express.json({ limit: '10mb' }))

// URL encoded parser
app.use(express.urlencoded({ extended: true }))

// Request logger (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger)
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check route (always first)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Root route of the API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Mercado Livre Clone API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      productById: '/api/products/:id',
      applyDiscount: 'POST /api/products/:id/discount'
    },
    documentation: 'https://github.com/seu-usuario/mercado-livre-clone/'
  })
})

// Product routes
app.use('/api/products', productRoutes)

// ============================================================================
// ERROR HANDLING (sempre por último)
// ============================================================================

// 404 para rotas não encontradas
app.use(notFound)

// Middleware global de erro
app.use(errorHandler)

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(PORT, () => {
  console.log('\n🚀 ================================')
  console.log('   MERCADOLIBRE CLONE API')
  console.log('================================')
  console.log(`🌐 Server: http://localhost:${PORT}`)
  console.log(`📚 API: http://localhost:${PORT}/api`)
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`)
  console.log(`📦 Products: http://localhost:${PORT}/api/products`)
  console.log(`📂 Categories: http://localhost:${PORT}/api/products/categories`)
  console.log('================================\n')
})

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido, encerrando servidor...')
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido (Ctrl+C), encerrando servidor...')
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso')
    process.exit(0)
  })
})

export default app