import { Request, Response, NextFunction } from 'express'

// ============================================================================
// ERROR HANDLING MIDDLEWARE - Centralized error handling
// ============================================================================

// Middleware to handle uncaught errors
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('💥 Uncaught error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  // If response has already been sent, delegate to Express
  if (res.headersSent) {
    return next(err)
  }

  // Standard error response
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
}

// Middleware for handling not found routes (404)
export function notFound(req: Request, res: Response) {
  console.log(`❌ Route not found: ${req.method} ${req.url}`)

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The route ${req.method} ${req.url} does not exist`
  })
}

// Middleware for logging requests (useful for debugging)
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  // Log the request
  console.log(`📥 ${req.method} ${req.url}`, {
    query: req.query,
    params: req.params,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Intercept the end of the response for logging
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const statusEmoji = status < 400 ? '✅' : status < 500 ? '⚠️' : '❌'
    
    console.log(`📤 ${statusEmoji} ${req.method} ${req.url} - ${status} (${duration}ms)`)
  })

  next()
}