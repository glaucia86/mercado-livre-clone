import { Request, Response } from 'express'
import { z } from 'zod'
import { productService } from '../services/product.service.js'

// ============================================================================
// VALIDATION SCHEMES - Using Zod for type-safe validation
// ============================================================================

// Schema for validating query parameters (?search=termo&category=smartphones)
const QuerySchema = z.object({
  category: z.string().optional(),                    
  search: z.string().optional(),                      
  minPrice: z.coerce.number().min(0).optional(),      
  maxPrice: z.coerce.number().min(0).optional(),      
  freeShipping: z.string()                            
    .transform(val => val === 'true')                 
    .optional(),
  page: z.coerce.number().min(1).default(1),          
  limit: z.coerce.number().min(1).max(50).default(12) 
})

// Schema for validating route parameters (/products/:id)
const ParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is mandatory')
})

// Schema for validating discount application body
const DiscountBodySchema = z.object({
  percentage: z.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot be greater than 100%')
})

// ============================================================================
// PRODUCT CONTROLLER - HTTP Controllers
// ============================================================================

export class ProductController {
  
  // ==========================================================================
  // GET /api/products - List products with filters
  // ==========================================================================
  
  async getProducts(req: Request, res: Response) {
    try {
      console.log('🔍 GET /api/products - Query:', req.query)
      
      // Validates and transforms query parameters
      const query = QuerySchema.parse(req.query)
      console.log('✅ Query validated:', query)

      // Separates pagination from filters
      const { page, limit, ...filters } = query

      // Calls the service
      const result = await productService.getAllProducts(filters, page, limit)

      console.log(`📦 Returning ${result.items.length} products (page ${page}/${result.totalPages})`)

      // Returns standardized response
      res.json({
        success: true,
        data: result
      })
      
    } catch (error) {
      console.error('❌ Error in getProducts:', error)

      // If it's a Zod validation error, return 400
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors  // Validation error details
        })
      }

      // Other errors return 500
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      })
    }
  }

  // ==========================================================================
  // GET /api/products/:id - Fetch specific product
  // ==========================================================================
  
  async getProductById(req: Request, res: Response) {
    try {
      console.log('🔍 GET /api/products/:id - Params:', req.params)

      // Validates the ID parameter
      const { id } = ParamsSchema.parse(req.params)
      console.log('✅ ID validated:', id)

      // Fetches the product
      const product = await productService.getProductById(id)

      // If not found, returns 404
      if (!product) {
        console.log(`❌ Product ${id} not found`)
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        })
      }

      console.log(`✅ Product found: ${product.title}`)

      res.json({
        success: true,
        data: product
      })
      
    } catch (error) {
      console.error('❌ Error in getProductById:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product'
      })
    }
  }

  // ==========================================================================
  // GET /api/products/categories - List available categories
  // ==========================================================================
  
  async getCategories(req: Request, res: Response) {
    try {
      console.log('🔍 GET /api/products/categories')
      
      const categories = await productService.getCategories()

      console.log(`✅ Returning ${categories.length} categories`)

      res.json({
        success: true,
        data: categories
      })
      
    } catch (error) {
      console.error('❌ Error in getCategories:', error)

      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      })
    }
  }

  // ==========================================================================
  // POST /api/products/:id/discount - Apply discount (for live coding)
  // ==========================================================================
  
  async applyDiscount(req: Request, res: Response) {
    try {
      console.log('🔍 POST /api/products/:id/discount - Params:', req.params, 'Body:', req.body)

      // Validates parameters and body
      const { id } = ParamsSchema.parse(req.params)
      const { percentage } = DiscountBodySchema.parse(req.body)

      console.log(`✅ Applying ${percentage}% discount to product ${id}`)

      // Applies the discount
      const product = await productService.applyDiscount(id, percentage)
      
      if (!product) {
        console.log(`❌ Product ${id} not found for discount`)
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        })
      }

      console.log(`✅ Discount applied successfully`)

      res.json({
        success: true,
        data: product,
        message: `Discount of ${percentage}% applied successfully`
      })
      
    } catch (error) {
      console.error('❌ Error in applyDiscount:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data for applying discount',
          details: error.errors
        })
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to apply discount'
      })
    }
  }

  // ==========================================================================
  // GET /api/products/stats - Fetch statistics (useful for debugging)
  // ==========================================================================
  
  async getStats(req: Request, res: Response) {
    try {
      console.log('🔍 GET /api/products/stats')
      
      const stats = await productService.getStats()
      
      res.json({
        success: true,
        data: stats
      })
      
    } catch (error) {
      console.error('❌ Error in getStats:', error)

      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      })
    }
  }
}

// Exports an instance of the controller
export const productController = new ProductController()