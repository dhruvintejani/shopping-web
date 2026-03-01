import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', productCount: 45 },
  { id: '2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', productCount: 38 },
  { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', productCount: 32 },
  { id: '4', name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', productCount: 28 },
  { id: '5', name: 'Sports & Outdoors', slug: 'sports', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop', productCount: 24 },
  { id: '6', name: 'Beauty & Personal Care', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', productCount: 21 },
  { id: '7', name: 'Toys & Games', slug: 'toys', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop', productCount: 19 },
  { id: '8', name: 'Health & Wellness', slug: 'health', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop', productCount: 15 },
];

const generateProducts = (): Product[] => {
  const productData = [
    // Electronics
    { title: 'Wireless Noise Canceling Headphones Pro', brand: 'SoundMax', category: 'Electronics', price: 299.99, originalPrice: 349.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', rating: 4.7, reviews: 12453, badge: 'bestseller' as const, stock: 150 },
    { title: 'Smart Watch Series X - GPS & Health Tracking', brand: 'TechFit', category: 'Electronics', price: 399.00, originalPrice: 449.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop', rating: 4.5, reviews: 8921, stock: 89 },
    { title: '4K Ultra HD Smart TV 55" - Quantum Display', brand: 'VisionPro', category: 'Electronics', price: 699.99, originalPrice: 899.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', rating: 4.6, reviews: 5632, badge: 'deal' as const, stock: 45 },
    { title: 'Wireless Earbuds Pro - Active Noise Cancellation', brand: 'SoundMax', category: 'Electronics', price: 179.99, originalPrice: 229.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', rating: 4.8, reviews: 23456, badge: 'bestseller' as const, stock: 234 },
    { title: 'Professional DSLR Camera with 18-55mm Lens', brand: 'CapturePro', category: 'Electronics', price: 1299.00, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', rating: 4.9, reviews: 3421, stock: 28 },
    { title: 'Portable Bluetooth Speaker - Waterproof', brand: 'BoomBox', category: 'Electronics', price: 79.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', rating: 4.4, reviews: 7823, stock: 312 },
    { title: 'Gaming Laptop 15.6" - RTX Graphics', brand: 'GameMaster', category: 'Electronics', price: 1499.99, originalPrice: 1699.99, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop', rating: 4.7, reviews: 2156, badge: 'new' as const, stock: 34 },
    { title: 'Wireless Charging Pad - Fast Charge 15W', brand: 'PowerUp', category: 'Electronics', price: 29.99, originalPrice: 39.99, image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=600&h=600&fit=crop', rating: 4.3, reviews: 9876, stock: 567 },
    { title: 'Smart Home Hub - Voice Control System', brand: 'HomeSmart', category: 'Electronics', price: 129.99, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop', rating: 4.2, reviews: 4532, stock: 123 },
    { title: 'Mechanical Gaming Keyboard RGB', brand: 'GameMaster', category: 'Electronics', price: 149.99, originalPrice: 179.99, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&h=600&fit=crop', rating: 4.6, reviews: 6789, stock: 189 },
    { title: 'Ultra-Wide Monitor 34" Curved', brand: 'VisionPro', category: 'Electronics', price: 549.99, originalPrice: 649.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop', rating: 4.5, reviews: 2345, stock: 67 },
    { title: 'Tablet Pro 12.9" with Stylus', brand: 'TechFit', category: 'Electronics', price: 899.00, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', rating: 4.8, reviews: 5678, badge: 'bestseller' as const, stock: 78 },
    
    // Fashion
    { title: 'Premium Running Shoes - Lightweight Design', brand: 'AthleticPro', category: 'Fashion', price: 129.99, originalPrice: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', rating: 4.6, reviews: 15678, badge: 'bestseller' as const, stock: 234 },
    { title: 'Classic Leather Jacket - Genuine Leather', brand: 'UrbanStyle', category: 'Fashion', price: 249.99, originalPrice: 299.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', rating: 4.7, reviews: 3456, stock: 89 },
    { title: 'Designer Sunglasses - UV Protection', brand: 'LuxeVision', category: 'Fashion', price: 189.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', rating: 4.4, reviews: 2345, stock: 156 },
    { title: 'Casual Denim Jeans - Slim Fit', brand: 'DenimCraft', category: 'Fashion', price: 79.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', rating: 4.3, reviews: 8765, stock: 345 },
    { title: 'Elegant Watch - Stainless Steel', brand: 'TimeMaster', category: 'Fashion', price: 299.00, originalPrice: 399.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', rating: 4.8, reviews: 4567, badge: 'deal' as const, stock: 67 },
    { title: 'Cotton T-Shirt Pack - Essential Basics', brand: 'ComfortWear', category: 'Fashion', price: 34.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', rating: 4.5, reviews: 12345, stock: 567 },
    { title: 'Winter Puffer Jacket - Insulated', brand: 'WinterGuard', category: 'Fashion', price: 199.99, originalPrice: 249.99, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b8?w=600&h=600&fit=crop', rating: 4.6, reviews: 2345, stock: 123 },
    { title: 'Leather Belt - Genuine Cowhide', brand: 'LeatherCraft', category: 'Fashion', price: 49.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', rating: 4.4, reviews: 5678, stock: 289 },
    
    // Home & Kitchen
    { title: 'Multi-Function Air Fryer 8 Quart', brand: 'ChefMaster', category: 'Home & Kitchen', price: 129.99, originalPrice: 169.99, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&h=600&fit=crop', rating: 4.7, reviews: 34567, badge: 'bestseller' as const, stock: 234 },
    { title: 'Robot Vacuum Cleaner - Smart Navigation', brand: 'CleanBot', category: 'Home & Kitchen', price: 349.99, originalPrice: 449.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', rating: 4.5, reviews: 12345, stock: 89 },
    { title: 'Espresso Machine - Barista Quality', brand: 'CoffeePro', category: 'Home & Kitchen', price: 299.00, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop', rating: 4.8, reviews: 5678, badge: 'new' as const, stock: 56 },
    { title: 'Stainless Steel Cookware Set - 12 Piece', brand: 'ChefMaster', category: 'Home & Kitchen', price: 199.99, originalPrice: 279.99, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', rating: 4.6, reviews: 8765, stock: 123 },
    { title: 'Smart Blender Pro - 1500W Motor', brand: 'BlendMaster', category: 'Home & Kitchen', price: 149.99, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop', rating: 4.4, reviews: 4567, stock: 178 },
    { title: 'Memory Foam Mattress Topper Queen', brand: 'DreamSleep', category: 'Home & Kitchen', price: 89.99, originalPrice: 119.99, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop', rating: 4.5, reviews: 9876, stock: 234 },
    { title: 'LED Smart Bulbs - 4 Pack Color Changing', brand: 'LightSmart', category: 'Home & Kitchen', price: 39.99, image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop', rating: 4.3, reviews: 6789, stock: 456 },
    { title: 'Luxury Towel Set - 100% Egyptian Cotton', brand: 'SpaLux', category: 'Home & Kitchen', price: 69.99, originalPrice: 89.99, image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=600&h=600&fit=crop', rating: 4.7, reviews: 3456, stock: 189 },
    
    // Books
    { title: 'The Art of Innovation - Business Bestseller', brand: 'PenguinBooks', category: 'Books', price: 24.99, originalPrice: 29.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop', rating: 4.8, reviews: 23456, badge: 'bestseller' as const, stock: 567 },
    { title: 'Mastering JavaScript - Complete Guide', brand: 'TechBooks', category: 'Books', price: 49.99, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop', rating: 4.6, reviews: 5678, stock: 234 },
    { title: 'The Psychology of Success', brand: 'MindPress', category: 'Books', price: 18.99, originalPrice: 24.99, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop', rating: 4.7, reviews: 12345, stock: 456 },
    { title: 'Healthy Cooking - 500 Recipes', brand: 'FoodieBooks', category: 'Books', price: 34.99, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop', rating: 4.5, reviews: 4567, stock: 345 },
    { title: 'World History - Illustrated Edition', brand: 'HistoryPress', category: 'Books', price: 39.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', rating: 4.4, reviews: 2345, stock: 123 },
    
    // Sports & Outdoors
    { title: 'Yoga Mat Premium - Non-Slip Surface', brand: 'FitLife', category: 'Sports & Outdoors', price: 39.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop', rating: 4.6, reviews: 8765, stock: 345 },
    { title: 'Adjustable Dumbbell Set - 5-50 lbs', brand: 'PowerFit', category: 'Sports & Outdoors', price: 299.99, originalPrice: 399.99, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', rating: 4.8, reviews: 4567, badge: 'deal' as const, stock: 89 },
    { title: 'Camping Tent - 4 Person Waterproof', brand: 'OutdoorPro', category: 'Sports & Outdoors', price: 179.99, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=600&fit=crop', rating: 4.5, reviews: 3456, stock: 78 },
    { title: 'Mountain Bike - 21 Speed', brand: 'TrailRider', category: 'Sports & Outdoors', price: 599.99, originalPrice: 749.99, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=600&fit=crop', rating: 4.7, reviews: 2345, stock: 45 },
    { title: 'Resistance Bands Set - 5 Levels', brand: 'FitLife', category: 'Sports & Outdoors', price: 24.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop', rating: 4.4, reviews: 12345, stock: 567 },
    { title: 'Running Hydration Pack - 2L Capacity', brand: 'HydroRun', category: 'Sports & Outdoors', price: 49.99, originalPrice: 59.99, image: 'https://images.unsplash.com/photo-1553969420-fb915228af51?w=600&h=600&fit=crop', rating: 4.5, reviews: 5678, stock: 234 },
    
    // Beauty & Personal Care
    { title: 'Vitamin C Serum - Anti-Aging Formula', brand: 'GlowSkin', category: 'Beauty & Personal Care', price: 29.99, originalPrice: 39.99, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', rating: 4.7, reviews: 23456, badge: 'bestseller' as const, stock: 456 },
    { title: 'Hair Dryer Pro - Ionic Technology', brand: 'StylePro', category: 'Beauty & Personal Care', price: 89.99, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop', rating: 4.5, reviews: 8765, stock: 234 },
    { title: 'Electric Toothbrush - Smart Timer', brand: 'OralCare', category: 'Beauty & Personal Care', price: 79.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1559467278-020d7b70adf3?w=600&h=600&fit=crop', rating: 4.6, reviews: 12345, stock: 345 },
    { title: 'Luxury Perfume - Floral Notes', brand: 'EssenceParfum', category: 'Beauty & Personal Care', price: 129.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', rating: 4.8, reviews: 4567, stock: 123 },
    { title: 'Makeup Brush Set - Professional 15 Piece', brand: 'BeautyTools', category: 'Beauty & Personal Care', price: 34.99, originalPrice: 44.99, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', rating: 4.4, reviews: 6789, stock: 289 },
    
    // Toys & Games
    { title: 'Building Blocks Set - 1000 Pieces', brand: 'BlockMaster', category: 'Toys & Games', price: 49.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop', rating: 4.8, reviews: 15678, badge: 'bestseller' as const, stock: 234 },
    { title: 'RC Racing Car - High Speed 4WD', brand: 'SpeedRacer', category: 'Toys & Games', price: 79.99, image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&h=600&fit=crop', rating: 4.5, reviews: 5678, stock: 167 },
    { title: 'Board Game - Strategy Adventure', brand: 'GameNight', category: 'Toys & Games', price: 44.99, originalPrice: 54.99, image: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=600&h=600&fit=crop', rating: 4.7, reviews: 8765, stock: 289 },
    { title: 'Puzzle Set - 2000 Pieces Landscape', brand: 'PuzzlePro', category: 'Toys & Games', price: 29.99, image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=600&h=600&fit=crop', rating: 4.4, reviews: 4567, stock: 345 },
    
    // Health & Wellness
    { title: 'Digital Blood Pressure Monitor', brand: 'HealthTrack', category: 'Health & Wellness', price: 49.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop', rating: 4.6, reviews: 12345, stock: 234 },
    { title: 'Protein Powder - Whey Isolate 2lb', brand: 'FitFuel', category: 'Health & Wellness', price: 39.99, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop', rating: 4.5, reviews: 23456, badge: 'bestseller' as const, stock: 456 },
    { title: 'Massage Gun - Deep Tissue Therapy', brand: 'RecoverPro', category: 'Health & Wellness', price: 129.99, originalPrice: 179.99, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop', rating: 4.7, reviews: 8765, badge: 'deal' as const, stock: 123 },
    { title: 'Essential Oils Set - 12 Pack', brand: 'AromaTherapy', category: 'Health & Wellness', price: 24.99, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop', rating: 4.4, reviews: 5678, stock: 345 },
  ];

  return productData.map((p, index) => ({
    id: `prod_${index + 1}`,
    title: p.title,
    description: `High-quality ${p.title.toLowerCase()} from ${p.brand}. Perfect for everyday use with premium materials and exceptional craftsmanship. Backed by our satisfaction guarantee.`,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    images: [p.image, p.image, p.image],
    rating: p.rating,
    reviews: p.reviews,
    category: p.category,
    brand: p.brand,
    stock: p.stock,
    badge: p.badge,
    tags: [p.category.toLowerCase(), p.brand.toLowerCase(), 'quality', 'popular'],
    specifications: {
      'Brand': p.brand,
      'Category': p.category,
      'Availability': p.stock > 0 ? 'In Stock' : 'Out of Stock',
      'Rating': `${p.rating} out of 5`,
    },
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

export const products: Product[] = generateProducts();

export const brands = [...new Set(products.map(p => p.brand))].sort();
