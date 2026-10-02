import React, { useState, useMemo } from 'react';
import { Product, ProductColor, CartItem, OrderConfirmation, SustainabilityTag } from './types';
import { PRODUCTS, heroImg, craftDetailImg } from './data/products';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CareGuideModal } from './components/CareGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';

import {
  Ruler,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Wind,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Feather,
  Heart,
} from 'lucide-react';

export default function App() {
  // Navigation & Category states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'impact'>('featured');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideProduct, setSizeGuideProduct] = useState<Product | null>(null);
  const [careGuideOpen, setCareGuideOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Cart & Wishlist state with local persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initial demo cart item so user immediately sees how cart & sustainability impact works
    const firstProduct = PRODUCTS[0];
    return [
      {
        id: 'init-cart-item-1',
        productId: firstProduct.id,
        product: firstProduct,
        size: 'M',
        color: firstProduct.colors[0],
        quantity: 1,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1]]);

  // Cart actions
  const handleAddToCart = (product: Product, size: string, color: ProductColor, quantity: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color.name === color.name
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${color.name}-${Date.now()}`,
          productId: product.id,
          product,
          size,
          color,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: string) => wishlist.some((p) => p.id === productId);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const materialMatch =
        selectedMaterial === 'All' ||
        p.sustainabilityTags.some((tag) => tag.toLowerCase() === selectedMaterial.toLowerCase()) ||
        p.material.toLowerCase().includes(selectedMaterial.toLowerCase());
      return categoryMatch && materialMatch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'impact') return b.metrics.waterSavedLiters - a.metrics.waterSavedLiters;
      return 0; // featured
    });
  }, [selectedCategory, selectedMaterial, sortBy]);

  // Aggregate stats across brand
  const totalWaterSavedAcrossCollection = PRODUCTS.reduce((sum, p) => sum + p.metrics.waterSavedLiters, 0);

  const openSizeGuideForProduct = (p?: Product) => {
    setSizeGuideProduct(p || selectedProduct || PRODUCTS[0]);
    setSizeGuideOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A1A1A] flex flex-col">
      {/* 3-Zone Navigation Header */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => openSizeGuideForProduct()}
        onOpenCareGuide={() => setCareGuideOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        onOpenSearch={() => setSearchOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* 1. STOREFRONT HERO: Campaign Focal Point */}
        {/* ======================================================== */}
        <section className="relative border-b border-[#E8E4DA] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Editorial Manifesto & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#666258] font-medium">
                  <span>Normandy Flax · Recycled Merino · 100% Circular</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1A1A1A] leading-[1.08] tracking-tight text-balance">
                  Garments Woven to Last, Designed to Care.
                </h1>

                <p className="text-sm sm:text-base text-[#5C574F] leading-relaxed max-w-xl">
                  Wear & Care crafts minimalist everyday apparel exclusively from traceable mono-materials: pure unbleached linen, regenerative organic cotton, and post-consumer recycled merino. Finished with our integrated size precision engine and free lifetime mending.
                </p>

                {/* Primary Actions (Single-line controls) */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('collection')}
                    className="px-6 py-3.5 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openSizeGuideForProduct(PRODUCTS[0])}
                    className="px-5 py-3.5 text-xs tracking-wider uppercase font-medium border border-[#D5CFBF] bg-white hover:bg-[#FAF8F5] text-[#1A1A1A] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Ruler className="w-4 h-4 text-[#2C3E2D]" />
                    <span>Interactive Size Guide</span>
                  </button>
                </div>

                {/* Proof Adjacency Metrics */}
                <div className="pt-6 border-t border-[#EAE6DE] grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-mono tabular-nums text-lg font-bold text-[#1A1A1A]">
                      0%
                    </div>
                    <div className="text-[11px] text-[#78736A] mt-0.5">Synthetic Polymers</div>
                  </div>
                  <div>
                    <div className="font-mono tabular-nums text-lg font-bold text-[#1A1A1A]">
                      100%
                    </div>
                    <div className="text-[11px] text-[#78736A] mt-0.5">Lifetime Mending Guarantee</div>
                  </div>
                  <div>
                    <div className="font-mono tabular-nums text-lg font-bold text-[#1A1A1A]">
                      2,400 L
                    </div>
                    <div className="text-[11px] text-[#78736A] mt-0.5">Avg. Water Conserved/Piece</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero High-Fidelity Editorial Visual */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-[#EBE7DC] border border-[#E0DBCF]">
                  <img
                    src={heroImg}
                    alt="Wear and Care Sustainable Campaign"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Media Overlay Annotation */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-white/80 font-mono">
                        Autumn / Spring Natural Flax Series
                      </div>
                      <div className="font-serif text-lg text-white">
                        Zero Synthetic Blends · Solar Mill Woven
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(PRODUCTS[0]);
                      }}
                      className="px-3 py-1.5 bg-white/90 hover:bg-white text-[#1A1A1A] text-xs font-medium rounded-lg backdrop-blur-xs transition-colors whitespace-nowrap"
                    >
                      Inspect Garment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. INTEGRATED SIZE GUIDE SPOTLIGHT CALLOUT */}
        {/* ======================================================== */}
        <section className="bg-[#FAF8F3] border-b border-[#E8E4DA] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E0D4] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0ECE1] text-[#2C3E2D] flex items-center justify-center shrink-0">
                  <Ruler className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2C3E2D]">
                      Engineered for Zero Returns
                    </span>
                    <span className="text-[#8A857A]">·</span>
                    <span className="text-xs text-[#706B62]">Integrated Sizing Advisor</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-[#1A1A1A]">
                    Not sure about your size? Calculate your tailored drape in 15 seconds.
                  </h3>
                  <p className="text-xs text-[#635E55] max-w-2xl">
                    Online apparel returns generate 16 million metric tons of CO₂ each year. Our interactive sizing engine inputs your height, weight, and fit taste to match garment ease perfectly.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSizeGuideForProduct(PRODUCTS[0])}
                className="w-full md:w-auto px-5 py-3 text-xs tracking-wider uppercase font-medium bg-[#2C3E2D] text-white hover:bg-[#1E2B1F] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-xs"
              >
                <span>Launch Size Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. FEATURED COLLECTION & FILTER BAR */}
        {/* ======================================================== */}
        <section id="collection" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header & Section Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
              <div>
                <div className="text-xs tracking-wider uppercase text-[#736E65] font-medium">
                  Curated Catalog · Monomaterial Focus
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] mt-1">
                  The Sustainable Collection
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#6B665E]">
                <span>Showing <strong className="font-mono tabular-nums text-[#1A1A1A]">{filteredProducts.length}</strong> conscious pieces</span>
                <span>·</span>
                {/* Sort selector */}
                <div className="flex items-center gap-1.5">
                  <label htmlFor="sort-select" className="text-[11px] uppercase tracking-wide">Sort:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-medium text-[#1A1A1A] border-none outline-none cursor-pointer hover:underline"
                  >
                    <option value="featured">Editorial Featured</option>
                    <option value="impact">Highest Water Conserved</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Segmented Controls (Filter Tabs) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-[#F2EFE8] rounded-lg">
                {['All', 'Overshirts', 'Knitwear', 'Trousers', 'Essentials'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'text-[#69655D] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Material Dropdown / Quick Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#78736A]">Fiber:</span>
                {['All', 'Flax Linen', 'Recycled Merino', 'Organic Cotton', 'Tencel'].map((mat) => {
                  const isActive =
                    mat === 'All'
                      ? selectedMaterial === 'All'
                      : selectedMaterial.toLowerCase().includes(mat.toLowerCase().split(' ')[0]);
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat === 'All' ? 'All' : mat)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        isActive
                          ? 'bg-[#2C3E2D] text-white'
                          : 'bg-white border border-[#E2DDD1] text-[#555148] hover:border-[#BDB7A9]'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRODUCT GRID (3 columns desktop, 2 tablet, 1 mobile) */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-[#FAF8F4] rounded-2xl border border-[#EAE5DA]">
                <p className="text-sm text-[#736E65]">No garments found in this category.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedMaterial('All');
                  }}
                  className="px-4 py-2 text-xs font-medium bg-[#1A1A1A] text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onOpenSizeGuide={(p) => openSizeGuideForProduct(p)}
                    isWishlisted={isWishlisted(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. SUSTAINABILITY MANIFESTO & THE CARE CYCLE */}
        {/* ======================================================== */}
        <section id="sustainability" className="py-16 sm:py-20 bg-[#F4F1EA] border-y border-[#E5E1D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Macro Craft Texture Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-[#DDD8CB] shadow-lg aspect-[4/3]">
                  <img
                    src={craftDetailImg}
                    alt="Natural linen fiber detail and botanical dyeing"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#E5E0D5] text-xs text-[#524E46]">
                    <div className="font-semibold text-[#1A1A1A]">100% Unblended Natural Fibers</div>
                    <div className="text-[11px] text-[#6E6A61] mt-0.5">
                      Synthetics lock garments out of the circular economy forever. We strictly weave mono-materials capable of being returned to earth or re-spun.
                    </div>
                  </div>
                </div>
              </div>

              {/* Manifesto Content */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#736E65] font-medium">
                    The Wear & Care Standard
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] mt-1 text-balance">
                    Fashion Built Around Care, Longevity, and Ecological Stewardship.
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E6E1D6] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <Droplets className="w-4 h-4 text-[#2C3E2D]" />
                      <span>Zero Chemical Dye Discharge</span>
                    </div>
                    <p className="text-xs text-[#635E55] leading-relaxed">
                      All garments use plant-derived tannins, pomegranate rinds, and low-impact certified dyestuffs with closed-loop wastewater recovery.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E6E1D6] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <Sparkles className="w-4 h-4 text-[#2C3E2D]" />
                      <span>Free Lifetime Atelier Mending</span>
                    </div>
                    <p className="text-xs text-[#635E55] leading-relaxed">
                      Every order includes matching organic repair thread and spare corozo nut buttons. Return any torn seam to our studio for free repairs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E6E1D6] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <Ruler className="w-4 h-4 text-[#2C3E2D]" />
                      <span>Integrated Fit Precision</span>
                    </div>
                    <p className="text-xs text-[#635E55] leading-relaxed">
                      Prevent return freight carbon footprint through calibrated dimensional garment charts and biometric fit estimation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E6E1D6] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                      <RotateCcw className="w-4 h-4 text-[#2C3E2D]" />
                      <span>20% Circular Take-Back Credit</span>
                    </div>
                    <p className="text-xs text-[#635E55] leading-relaxed">
                      When your piece finally retires, return it in our mailer to be unraveled into fresh recycled knitwear. Receive 20% in circular store credit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCareGuideOpen(true)}
                    className="px-5 py-3 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <span>Read Garment Care Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openSizeGuideForProduct()}
                    className="px-4 py-3 text-xs tracking-wider uppercase font-medium border border-[#D5CFBF] bg-white hover:bg-[#FAF8F5] text-[#1A1A1A] rounded-lg transition-colors"
                  >
                    Fit Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. CIRCULAR CYCLE PROMISE */}
        {/* ======================================================== */}
        <section id="circularity" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <div className="text-xs uppercase tracking-widest text-[#736E65] font-medium">
              A Closed Loop Journey
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A]">
              The Care Cycle: How It Works
            </h2>
            <p className="text-xs sm:text-sm text-[#615C53]">
              We take responsibility for every garment long after it leaves our hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E8E4DA] space-y-3 shadow-2xs">
              <span className="text-xs font-mono text-[#2C3E2D] font-bold">01</span>
              <h3 className="text-base font-serif text-[#1A1A1A]">Grown Without Toxins</h3>
              <p className="text-xs text-[#635E55] leading-relaxed">
                Raw Normandy flax, rainwater-fed hemp, and regenerative organic cotton with zero pesticides.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E4DA] space-y-3 shadow-2xs">
              <span className="text-xs font-mono text-[#2C3E2D] font-bold">02</span>
              <h3 className="text-base font-serif text-[#1A1A1A]">Fitted to Perfection</h3>
              <p className="text-xs text-[#635E55] leading-relaxed">
                Our sizing engine ensures you receive the exact cut you want, avoiding return transit fuel.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E4DA] space-y-3 shadow-2xs">
              <span className="text-xs font-mono text-[#2C3E2D] font-bold">03</span>
              <h3 className="text-base font-serif text-[#1A1A1A]">Repaired For Decades</h3>
              <p className="text-xs text-[#635E55] leading-relaxed">
                Free spare threads and buttons in every box, backed by our atelier lifetime repair warranty.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E4DA] space-y-3 shadow-2xs">
              <span className="text-xs font-mono text-[#2C3E2D] font-bold">04</span>
              <h3 className="text-base font-serif text-[#1A1A1A]">Re-Spun & Reborn</h3>
              <p className="text-xs text-[#635E55] leading-relaxed">
                Return at life's end for 20% credit. Fibers are unraveled mechanically into next season's yarn.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 6. REFINED MINIMALIST FOOTER */}
      {/* ======================================================== */}
      <footer className="bg-[#FAF8F3] border-t border-[#E8E4DA] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Wordmark & Ethics */}
            <div className="space-y-3">
              <div className="text-lg font-serif tracking-[0.2em] font-medium uppercase text-[#1A1A1A]">
                Wear & Care
              </div>
              <p className="text-xs text-[#6E6A61] leading-relaxed">
                Earth-first apparel crafted with radical material transparency. Woven from 100% natural, biodegradable fibers.
              </p>
              <div className="text-[11px] font-mono text-[#2C3E2D]">
                Guimarães · Biella · Izmir
              </div>
            </div>

            {/* Col 2: Shop Navigation */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Collection
              </div>
              <ul className="space-y-1.5 text-[#635F56]">
                <li>
                  <button onClick={() => setSelectedCategory('Overshirts')} className="hover:text-[#1A1A1A] transition-colors">
                    Flaxen Overshirts
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('Knitwear')} className="hover:text-[#1A1A1A] transition-colors">
                    Recycled Merino Knits
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('Trousers')} className="hover:text-[#1A1A1A] transition-colors">
                    Organic Twill Trousers
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('Essentials')} className="hover:text-[#1A1A1A] transition-colors">
                    Hemp Combed Tees
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Care & Sizing */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Care & Fitting
              </div>
              <ul className="space-y-1.5 text-[#635F56]">
                <li>
                  <button onClick={() => openSizeGuideForProduct()} className="hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-[#2C3E2D]" />
                    <span>Interactive Size Guide</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCareGuideOpen(true)} className="hover:text-[#1A1A1A] transition-colors">
                    Low-Impact Laundry Manual
                  </button>
                </li>
                <li>
                  <button onClick={() => setCareGuideOpen(true)} className="hover:text-[#1A1A1A] transition-colors">
                    Request Free Mending Supplies
                  </button>
                </li>
                <li>
                  <button onClick={() => setCareGuideOpen(true)} className="hover:text-[#1A1A1A] transition-colors">
                    Circular Take-Back Program
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter / Transparency report */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Circularity Dispatch
              </div>
              <p className="text-[#6E6A61] text-[11px] leading-relaxed">
                Receive our quarterly textile carbon harvest reports and early notifications on limited botanical dye runs.
              </p>
              {newsletterSubscribed ? (
                <div className="p-2.5 rounded-lg bg-[#EAF2EB] text-[#2C3E2D] text-xs font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed to circularity dispatch.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewsletterSubscribed(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    className="px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs flex-1 focus:outline-none focus:border-[#2C3E2D]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#1A1A1A] text-white rounded-lg text-xs font-medium hover:bg-[#333333] transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE6DE] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78746B] gap-3">
            <div>© {new Date().getFullYear()} Wear & Care Apparel Ltd. All rights reserved. Zero synthetic plastic guarantee.</div>
            <div className="flex items-center gap-4">
              <span>GOTS Certified Organic</span>
              <span>·</span>
              <span>European Flax®</span>
              <span>·</span>
              <span>Global Recycled Standard</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODALS & DRAWERS */}
      {/* ======================================================== */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={(p) => openSizeGuideForProduct(p)}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        product={sizeGuideProduct}
        onSelectSize={(sz) => {
          // If a product is currently open in detail modal, we can let user pick size
          console.log('Selected size:', sz);
        }}
      />

      <CareGuideModal
        isOpen={careGuideOpen}
        onClose={() => setCareGuideOpen(false)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem => handleRemoveFromCart(handleRemoveCartItem)}
        onOrderComplete={(order) => setOrderConfirmation(order)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenSizeGuide={(p) => openSizeGuideForProduct(p)}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <OrderConfirmationModal
        isOpen={!!orderConfirmation}
        order={orderConfirmation}
        onClose={() => {
          setOrderConfirmation(null);
          setCart([]); // Clear cart after order is acknowledged
        }}
      />
    </div>
  );
}
