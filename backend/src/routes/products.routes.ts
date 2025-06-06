import { Router } from 'express';
import { productController } from '../controllers/products.controller';

// ============================================================================
// PRODUCT ROUTES - Defining HTTP routes
// ============================================================================

const router = Router();

// Route to list products with filters
// GET /api/products?search=samsung&category=smartphones&page=1&limit=10
router.get('/', async (req, res) => {
  await productController.getProducts(req, res);
})

// Route to fetch categories (must come BEFORE the /:id route)
// GET /api/products/categories
router.get('/categories', async (req, res) => {
  await productController.getCategories(req, res);
})

// Route to fetch statistics (useful for debugging)
// GET /api/products/stats
router.get('/stats', async (req, res) => {
  await productController.getStats(req, res);
})

// Route to fetch specific product
// GET /api/products/ML-001
router.get('/:id', async (req, res) => {
  await productController.getProductById(req, res);
})

// Route to apply discount (POST to modify state)
// POST /api/products/ML-001/discount
router.post('/:id/discount', async (req, res) => {
  await productController.applyDiscount(req, res);
})

export default router