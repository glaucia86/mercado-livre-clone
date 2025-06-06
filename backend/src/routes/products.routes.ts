import { Router } from 'express';
import { productController } from '../controllers/products.controller';

// ============================================================================
// PRODUCT ROUTES - Defining HTTP routes
// ============================================================================

const router = Router();

// Route to list products with filters
// GET /api/products?search=samsung&category=smartphones&page=1&limit=10
router.get('/', productController.getProducts.bind(productController))

// Route to fetch categories (must come BEFORE the /:id route)
// GET /api/products/categories
router.get('/categories', productController.getCategories.bind(productController))

// Route to fetch statistics (useful for debugging)
// GET /api/products/stats
router.get('/stats', productController.getStats.bind(productController))

// Route to fetch specific product
// GET /api/products/ML-001
router.get('/:id', productController.getProductById.bind(productController))

// Route to apply discount (POST to modify state)
// POST /api/products/ML-001/discount
router.post('/:id/discount', productController.applyDiscount.bind(productController))

export default router