
import path from "path";
import fs from "fs/promises";
import { PaginatedResponse, Product, ProductFilters } from "../types";
// ============================================================================
// PRODUCT SERVICE - Business logic for products


// ===========================================================================
class ProductService {
  private products: Product[] = []; // Product cache in memory
  private dataLoaded = false; // Flag to avoid reloading data

  // ==========================================================================
  // PRIVATE METHOD: Data Loading
  // ==========================================================================
  private async loadData(): Promise<void> {
    if (this.dataLoaded) return; // Avoid reloading if already done

    try {
      // Path to JSON file
      const dataPath = path.join(process.cwd(), 'src/data/products.json');

      // Read the file as a string
      const rawData = await fs.readFile(dataPath, 'utf-8');

      // Convert JSON to JavaScript object
      const data = JSON.parse(rawData);

      // Mark as loaded
      this.dataLoaded = true;

      console.log(`✅ Product data loaded successfully: ${this.products.length} items`);
    } catch (error) {
      console.error('❌ Error loading product data...: ', error);
      throw new Error('Failed to load product data');
    }
  }

  // ==========================================================================
  //  PUBLIC METHOD: Search All Products with Filters
  // ==========================================================================
  async getAllProducts(filters: ProductFilters = {}, page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
     await this.loadData();

     let filteredProducts = [...this.products];

    // Apply filters

    // Filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      console.log(`🔍 Filtered by category: ${filters.category}: ${filteredProducts.length} products!`);
    }

    // Filter by text search (title and description)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      )
      console.log(`🔍 Search "${filters.search}": ${filteredProducts.length} products!`);
    }

    // Filter by min price
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      console.log(`🔍 Filtered by min price: ${filters.minPrice}: ${filteredProducts.length} products!`);
    }

    // Filter by max price
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      console.log(`🔍 Filtered by max price: ${filters.maxPrice}: ${filteredProducts.length} products!`);
    }

    // Filter by free shipping
    if (filters.freeShipping) {
      filteredProducts = filteredProducts.filter(p => p.shipping.free);
      console.log(`🔍 Filtered by free shipping: ${filteredProducts.length} products!`);
    }

    // Pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const items = filteredProducts.slice(offset, offset + limit);

    console.log(`📄 Page ${page}/${totalPages}: ${items.length} items`);

    return {
      items,
      total,
      page,
      limit,
      totalPages
    }
  }

  // ==========================================================================
  // PUBLIC METHOD: Search Product by ID
  // ==========================================================================
  async getProductById(id: string): Promise<Product | null> {
    await this.loadData();

    try {
      const product = this.products.find(p => p.id === id);

      if (product) {
        console.log(`✅ Produto encontrado: ${product.title}`);
      } else {
        console.log(`❌ Produto não encontrado: ${id}`);
      }

      return product || null;
    } catch (error) {
      console.error('❌ Error fetching product by ID: ', error);
      throw new Error('Failed to fetch product by ID');
    }
  }

  // ==========================================================================
  // PUBLIC METHOD: Get Available Categories
  // ==========================================================================
  async getCategories(): Promise<string[]> {
    await this.loadData();

    try {
      const categories = [...new Set(this.products.map(p => p.category))];

      console.log(`📂 Categories available...: ${categories.join(', ')}`);

      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories: ', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // ==========================================================================
  // PUBLIC METHOD: Apply Discount (for live coding)
  // ==========================================================================
  async applyDiscount(productId: string, percentage: number): Promise<Product | null> {
    await this.loadData()
    
    try {
      // Search for the product by ID
      const product = this.products.find(p => p.id === productId);

      if (!product) {
        console.log(`❌ Product not found for discount: ${productId}`);
        return null;
      }

      // Validate the percentage
      if (percentage < 0 || percentage > 100) {
        throw new Error('Discount percentage must be between 0 and 100');
      }

      // Calculates the discounted price
      const discountedPrice = product.price * (1 - percentage / 100);
      const discountAmount = product.price - discountedPrice;

      console.log(`💰 Applying ${percentage}% discount to "${product.title}"`);
      console.log(`💰 Original price: R$ ${product.price.toFixed(2)}`);
      console.log(`💰 Discounted price: R$ ${discountedPrice.toFixed(2)}`);
      console.log(`💰 Savings: R$ ${discountAmount.toFixed(2)}`);

      // Returns product with applied discount
      return {
        ...product,
        price: discountedPrice,
        originalPrice: product.price,    // Preserves original price
        discount: {
          percentage,
          amount: discountAmount
        }
      }
    } catch (error) {
      console.error('❌ Error applying discount: ', error);
      throw new Error('Failed to apply discount');
    }
  }

  // ==========================================================================
  // PUBLIC METHOD: Statistics (useful for debugging)
  // ==========================================================================
  async getStats() {
    await this.loadData();

    try {
      const stats = {
        totalProducts: this.products.length,
        categories: await this.getCategories(),
        priceRange: {
          min: Math.min(...this.products.map(p => p.price)),
          max: Math.max(...this.products.map(p => p.price)),
          average: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length,
        },
        stockTotal: this.products.reduce((sum, p) => sum + p.stock, 0),
      }

      console.log('📊 Product Statistics:', stats)
      return stats;
    } catch (error) {
      console.error('❌ Error fetching product statistics: ', error);
      throw new Error('Failed to fetch product statistics');
    }
  }
}

export const productService = new ProductService();
