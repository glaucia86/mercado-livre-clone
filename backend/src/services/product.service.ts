
import path from "path";
import fs from "fs/promises";
import { PaginatedResponse, Product, ProductFilters } from "../types";

class ProductService {
  private products: Product[] = []; // Product cache in memory
  private dataLoaded = false; // Flag to avoid reloading data

  private async loadData(): Promise<void> {
  if (this.dataLoaded) return

  try {
    const possiblePaths = [
      path.join(import.meta.dirname, '../data/products.json'),
      path.join(process.cwd(), 'src/data/products.json'),
      path.resolve('src/data/products.json'),
      './src/data/products.json'
    ]

    let rawData: string | null = null
    let usedPath: string | null = null

    for (const dataPath of possiblePaths) {
      try {
        console.log(`🔍 Trying to load: ${dataPath}`)
        rawData = await fs.readFile(dataPath, 'utf-8')
        usedPath = dataPath
        break
      } catch (err) {
        console.log(`❌ NNot found in: ${dataPath}`)
        continue
      }
    }

    if (!rawData) {
      throw new Error('File products.json not found in any path')
    }

    console.log(`✅ File found in: ${usedPath}`)

    const data = JSON.parse(rawData)
    this.products = data.products
    this.dataLoaded = true

    console.log(`✅ Data loaded: ${this.products.length} products`)

  } catch (error) {
    console.error('❌ Error loading products:', error)
    throw new Error('Failed to load products')
  }
}

  async getAllProducts(filters: ProductFilters = {}, page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
     await this.loadData();

     let filteredProducts = [...this.products];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      console.log(`🔍 Filtered by category: ${filters.category}: ${filteredProducts.length} products!`);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      )
      console.log(`🔍 Search "${filters.search}": ${filteredProducts.length} products!`);
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      console.log(`🔍 Filtered by min price: ${filters.minPrice}: ${filteredProducts.length} products!`);
    }

    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      console.log(`🔍 Filtered by max price: ${filters.maxPrice}: ${filteredProducts.length} products!`);
    }

    if (filters.freeShipping) {
      filteredProducts = filteredProducts.filter(p => p.shipping.free);
      console.log(`🔍 Filtered by free shipping: ${filteredProducts.length} products!`);
    }

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

  async applyDiscount(productId: string, percentage: number): Promise<Product | null> {
    await this.loadData()
    
    try {
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
