'use client';

import {
  CreditCard,
  Filter,
  Grid,
  Heart,
  List,
  Menu,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Types
type StoreType = 'fashion' | 'electronics' | 'furniture' | 'beauty' | 'grocery' | 'general';
type LayoutStyle = 'grid' | 'list' | 'masonry';
type ColorScheme = 'light' | 'dark' | 'custom';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  inStock: boolean;
  badge?: 'sale' | 'new' | 'bestseller' | 'limited';
  colors?: string[];
  sizes?: string[];
};

type Category = {
  id: string;
  name: string;
  count: number;
  subcategories?: Category[];
};

type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type StoreConfig = {
  type: StoreType;
  name: string;
  logo: string;
  primaryColor: string;
  colorScheme: ColorScheme;
  currency: string;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  showPromoBar: boolean;
  promoText: string;
  freeShippingThreshold: number;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type EcommerceMockupProps = {
  variant?: Variant;
  config?: Partial<StoreConfig>;
  onConfigChange?: (config: StoreConfig) => void;
  className?: string;
};

// Default configuration
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Leather Jacket',
    description: 'Premium quality leather jacket with modern fit',
    price: 299.99,
    originalPrice: 399.99,
    image: '',
    rating: 4.8,
    reviews: 124,
    category: 'Outerwear',
    tags: ['leather', 'jacket', 'premium'],
    inStock: true,
    badge: 'sale',
    colors: ['#000000', '#8B4513', '#4A4A4A'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Wireless Headphones Pro',
    description: 'Active noise cancellation with 30hr battery',
    price: 249.99,
    image: '',
    rating: 4.9,
    reviews: 892,
    category: 'Electronics',
    tags: ['audio', 'wireless', 'premium'],
    inStock: true,
    badge: 'bestseller',
    colors: ['#000000', '#FFFFFF', '#1E3A8A'],
  },
  {
    id: '3',
    name: 'Minimalist Watch',
    description: 'Elegant timepiece with sapphire crystal',
    price: 179.99,
    image: '',
    rating: 4.7,
    reviews: 256,
    category: 'Accessories',
    tags: ['watch', 'minimalist', 'elegant'],
    inStock: true,
    badge: 'new',
    colors: ['#C0C0C0', '#FFD700', '#CD7F32'],
  },
  {
    id: '4',
    name: 'Running Shoes Ultra',
    description: 'Lightweight performance running shoes',
    price: 129.99,
    originalPrice: 159.99,
    image: '',
    rating: 4.6,
    reviews: 567,
    category: 'Footwear',
    tags: ['shoes', 'running', 'sports'],
    inStock: true,
    badge: 'sale',
    colors: ['#FF4500', '#000000', '#4169E1'],
    sizes: ['7', '8', '9', '10', '11', '12'],
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    description: '100% organic cotton, eco-friendly',
    price: 39.99,
    image: '',
    rating: 4.5,
    reviews: 1024,
    category: 'Clothing',
    tags: ['cotton', 'organic', 'sustainable'],
    inStock: true,
    colors: ['#FFFFFF', '#000000', '#228B22', '#4169E1'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: '6',
    name: 'Smart Home Hub',
    description: 'Control all your smart devices from one place',
    price: 149.99,
    image: '',
    rating: 4.4,
    reviews: 342,
    category: 'Electronics',
    tags: ['smart home', 'automation', 'hub'],
    inStock: false,
    colors: ['#FFFFFF', '#333333'],
  },
];

const defaultCategories: Category[] = [
  { id: '1', name: 'Clothing', count: 156, subcategories: [
    { id: '1a', name: 'T-Shirts', count: 45 },
    { id: '1b', name: 'Jeans', count: 32 },
    { id: '1c', name: 'Dresses', count: 28 },
  ] },
  { id: '2', name: 'Electronics', count: 89 },
  { id: '3', name: 'Accessories', count: 67 },
  { id: '4', name: 'Footwear', count: 54 },
  { id: '5', name: 'Outerwear', count: 43 },
];

const defaultConfig: StoreConfig = {
  type: 'fashion',
  name: 'StyleStore',
  logo: '',
  primaryColor: '#3B82F6',
  colorScheme: 'light',
  currency: 'USD',
  products: defaultProducts,
  categories: defaultCategories,
  cart: [],
  showPromoBar: true,
  promoText: 'FREE SHIPPING on orders over $50! Use code: FREESHIP',
  freeShippingThreshold: 50,
};

// Badge styles
const badgeStyles: Record<string, { bg: string; text: string }> = {
  sale: { bg: 'bg-red-500', text: 'SALE' },
  new: { bg: 'bg-green-500', text: 'NEW' },
  bestseller: { bg: 'bg-amber-500', text: 'BESTSELLER' },
  limited: { bg: 'bg-purple-500', text: 'LIMITED' },
};

export function EcommerceMockup({
  variant = 'full',
  config: initialConfig,
  onConfigChange,
  className = '',
}: EcommerceMockupProps) {
  const [config, setConfig] = useState<StoreConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [viewLayout, setViewLayout] = useState<LayoutStyle>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const updateConfig = useCallback((updates: Partial<StoreConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const isDark = config.colorScheme === 'dark';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.currency,
    }).format(price);
  };

  const cartTotal = config.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = config.cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const addToCart = (product: Product) => {
    const existingItem = config.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      updateConfig({
        cart: config.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      updateConfig({
        cart: [...config.cart, { product, quantity: 1 }],
      });
    }
  };

  // Render Promo Bar
  const renderPromoBar = () => (
    config.showPromoBar && (
      <div style={{ backgroundColor: config.primaryColor }} className="px-4 py-2 text-center text-white">
        <p className="flex items-center justify-center space-x-2 text-sm font-medium">
          <Tag className="h-4 w-4" />
          <span>{config.promoText}</span>
        </p>
      </div>
    )
  );

  // Render Header
  const renderHeader = () => (
    <header className={`sticky top-0 z-50 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} border-b`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button className="p-2 lg:hidden" onClick={() => setShowFilters(!showFilters)}>
              <Menu className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              {config.name.charAt(0)}
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.name}
            </span>
          </div>

          {/* Search */}
          <div className="mx-8 hidden max-w-xl flex-1 md:flex">
            <div className="relative w-full">
              <Search className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg border py-2 pr-4 pl-10 ${isDark ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:outline-none`}
                style={{ '--tw-ring-color': config.primaryColor } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className={`hidden items-center space-x-1 md:flex ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              <User className="h-5 w-5" />
              <span className="text-sm">Account</span>
            </button>
            <button className={`relative p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: config.primaryColor }}>
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              className={`relative p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: config.primaryColor }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Render Categories Sidebar
  const renderSidebar = () => (
    <aside className={`hidden w-64 lg:block ${isDark ? 'bg-gray-900' : 'bg-white'} p-6`}>
      <h3 className={`mb-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Categories</h3>
      <ul className="space-y-2">
        {config.categories.map(category => (
          <li key={category.id}>
            <button
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${
                selectedCategory === category.id
                  ? 'text-white'
                  : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={selectedCategory === category.id ? { backgroundColor: config.primaryColor } : undefined}
            >
              <span>{category.name}</span>
              <span className="text-sm opacity-60">
                (
                {category.count}
                )
              </span>
            </button>
            {category.subcategories && selectedCategory === category.id && (
              <ul className="mt-2 ml-4 space-y-1">
                {category.subcategories.map(sub => (
                  <li key={sub.id}>
                    <button className={`w-full rounded px-3 py-1 text-left ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      {sub.name}
                      {' '}
                      (
                      {sub.count}
                      )
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Price Filter */}
      <div className="mt-8">
        <h3 className={`mb-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Price Range</h3>
        <div className="space-y-3">
          {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map(range => (
            <label key={range} className="flex cursor-pointer items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 rounded" style={{ accentColor: config.primaryColor }} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mt-8">
        <h3 className={`mb-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex cursor-pointer items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 rounded" style={{ accentColor: config.primaryColor }} />
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                  />
                ))}
                <span className={`ml-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  // Render Product Card
  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className={`group overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-shadow hover:shadow-lg`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
        {(() => {
          const badge = product.badge;
          const style = badge ? badgeStyles[badge] : undefined;
          return style
            ? (
                <span className={`absolute top-3 left-3 rounded px-2 py-1 text-xs font-semibold text-white ${style.bg}`}>
                  {style.text}
                </span>
              )
            : null;
        })()}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-current text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className={`h-16 w-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        {/* Quick Add */}
        <div className="absolute right-0 bottom-0 left-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`w-full rounded-lg py-2 font-medium text-white ${!product.inStock ? 'cursor-not-allowed bg-gray-400' : ''}`}
            style={product.inStock ? { backgroundColor: config.primaryColor } : undefined}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className={`mb-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {product.category}
        </p>
        <h3 className={`mb-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
          {product.name}
        </h3>
        <p className={`mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-clamp-2`}>
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-2 flex items-center space-x-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            (
            {product.reviews}
            )
          </span>
        </div>

        {/* Colors */}
        {product.colors && (
          <div className="mb-3 flex space-x-1">
            {product.colors.map((color, i) => (
              <button
                key={i}
                className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-xs font-medium text-red-500">
              -
              {Math.round((1 - product.price / product.originalPrice) * 100)}
              %
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Render Cart Sidebar
  const renderCartSidebar = () => (
    showCart && (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
        <div className={`relative w-full max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'} h-full overflow-auto`}>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Shopping Cart (
                {cartCount}
                )
              </h2>
              <button onClick={() => setShowCart(false)}>
                <X className={`h-6 w-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>

            {config.cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className={`mx-auto mb-4 h-16 w-16 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-4">
                  {config.cart.map(item => (
                    <div key={item.product.id} className={`flex space-x-4 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <button className={`rounded p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className={`w-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {item.quantity}
                          </span>
                          <button className={`rounded p-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button className={`self-start ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Free Shipping Progress */}
                {cartTotal < config.freeShippingThreshold && (
                  <div className={`mb-6 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <div className="mb-2 flex items-center space-x-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Add
                        {' '}
                        {formatPrice(config.freeShippingThreshold - cartTotal)}
                        {' '}
                        more for FREE shipping!
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.min((cartTotal / config.freeShippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-4`}>
                  <div className="mb-2 flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="mb-4 flex justify-between">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {cartTotal >= config.freeShippingThreshold ? 'FREE' : formatPrice(9.99)}
                    </span>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatPrice(cartTotal + (cartTotal >= config.freeShippingThreshold ? 0 : 9.99))}
                    </span>
                  </div>
                  <button
                    className="w-full rounded-lg py-3 font-semibold text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );

  // Render Trust Badges
  const renderTrustBadges = () => (
    <div className={`py-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: Shield, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
            { icon: CreditCard, title: 'Payment Options', desc: 'All major cards accepted' },
          ].map((badge, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${config.primaryColor}20` }}
              >
                <badge.icon className="h-6 w-6" style={{ color: config.primaryColor }} />
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{badge.title}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {config.products.slice(0, 4).map(product => (
              <div key={product.id} className={`rounded-lg p-2 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="mb-2 aspect-square rounded bg-gradient-to-br from-gray-200 to-gray-300" />
                <p className={`truncate text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <ShoppingCart className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>E-commerce Mockup</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="text-center text-white">
            <Package className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">{config.name}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.name}
              {' '}
              Store
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewLayout('grid')}
              className={`rounded p-1 ${viewLayout === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`rounded p-1 ${viewLayout === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-[400px] overflow-auto p-4">
          <div className={`grid ${viewLayout === 'grid' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-3'}`}>
            {config.products.slice(0, 4).map(product => renderProductCard(product))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${className}`}>
      {renderPromoBar()}
      {renderHeader()}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex">
          {renderSidebar()}

          {/* Main Content */}
          <main className="flex-1 lg:pl-8">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing
                {' '}
                {config.products.length}
                {' '}
                products
              </p>
              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center space-x-2 rounded-lg border px-4 py-2 lg:hidden ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <select className={`rounded-lg border px-4 py-2 ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}>
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Best Rating</option>
                </select>
                <div className="hidden items-center space-x-1 md:flex">
                  <button
                    onClick={() => setViewLayout('grid')}
                    className={`rounded-lg p-2 ${viewLayout === 'grid' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    style={viewLayout === 'grid' ? { backgroundColor: config.primaryColor } : undefined}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewLayout('list')}
                    className={`rounded-lg p-2 ${viewLayout === 'list' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    style={viewLayout === 'list' ? { backgroundColor: config.primaryColor } : undefined}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid ${viewLayout === 'grid' ? 'grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 gap-4'}`}>
              {config.products.map(product => renderProductCard(product))}
            </div>
          </main>
        </div>
      </div>

      {renderTrustBadges()}
      {renderCartSidebar()}
    </div>
  );
}

export default EcommerceMockup;
