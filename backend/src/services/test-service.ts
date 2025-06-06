import { productService } from "./product.service";

async function testService() {
  console.log('🧪 Testing Product Service... ');

  try {
    console.log('Test 01: List all products');
    const allProducts = await productService.getAllProducts();
    console.log(`Result: ${allProducts.items.length} products, ${allProducts.totalPages} pages\n`);

    console.log('Test 02: Search products by category "smartphones"');
    const smartphones = await productService.getAllProducts({ category: 'smartphones' });
    console.log(`Result: ${smartphones.items.length} smartphones\n`);

    console.log('Test 03: Search for "Samsung"');
    const samsungProducts = await productService.getAllProducts({ search: 'Samsung' });
    console.log(`Result: ${samsungProducts.items.length} products found with "Samsung"\n`);

    console.log('📋 Test 04: Search product ML-001');
    const product = await productService.getProductById('ML-001');
    console.log(`Result: ${product ? product.title : 'Not found'}\n`);

    console.log('📋 Test 05: Apply 15% discount on ML-001');
    const discountedProduct = await productService.applyDiscount('ML-001', 15);
    console.log(`Result: Original price R$ ${discountedProduct?.originalPrice}, with discount R$ ${discountedProduct?.price}\n`);

    console.log('📋 Test 06: General statistics');
    const stats = await productService.getStats();

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error testing product service: ', error);
  }
}

if(import.meta.url === `file://${process.argv[1]}`) {
  testService();
}