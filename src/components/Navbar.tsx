import React, { useState } from 'react';
import { ShoppingBag, Search, Ruler, Heart, Sparkles, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSizeGuide: () => void;
  onOpenCareGuide: () => void;
  onOpenWishlist: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  onOpenSearch: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSizeGuide,
  onOpenCareGuide,
  onOpenWishlist,
  onSelectCategory,
  onOpenSearch,
  onScrollToSection,
}) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E9E5DC]">
      {/* Slim Promotional Banner (<= 40px) */}
      {showBanner && (
        <div className="bg-[#2C3E2D] text-[#ECE8DE] px-4 py-2 text-[11px] font-medium tracking-wide flex items-center justify-between">
          <div className="mx-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8BFA9] animate-pulse" />
            <span>Complimentary carbon-neutral delivery over $120 · Free lifetime repair support</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#B9C7BA] hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Strict 1-Row 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl sm:text-2xl font-serif tracking-[0.2em] font-medium uppercase text-[#1A1A1A] hover:opacity-85 transition-opacity text-left cursor-pointer"
        >
          Wear & Care
        </button>

        {/* Zone 2: 4-6 clean text navigation links (No pills, hover underlines) */}
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-[#59554E]">
          <button
            type="button"
            onClick={() => onScrollToSection('collection')}
            className="hover:text-[#1A1A1A] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#1A1A1A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Shop Collection
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('sustainability')}
            className="hover:text-[#1A1A1A] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#1A1A1A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Traceability & Impact
          </button>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="hover:text-[#1A1A1A] transition-colors relative py-1 flex items-center gap-1.5 text-[#2C3E2D]"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
          <button
            type="button"
            onClick={onOpenCareGuide}
            className="hover:text-[#1A1A1A] transition-colors relative py-1 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#888377]" />
            <span>Care Standard</span>
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('circularity')}
            className="hover:text-[#1A1A1A] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[#1A1A1A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Circular Cycle
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Search, Wishlist, Bag) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-[#4A463F] hover:text-[#1A1A1A] hover:bg-[#EFEBE2] rounded-lg transition-colors"
            title="Search garments"
            aria-label="Search garments"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="p-2 text-[#4A463F] hover:text-[#1A1A1A] hover:bg-[#EFEBE2] rounded-lg transition-colors relative"
            title="Wishlist"
            aria-label="Saved items"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#945846] text-white text-[10px] flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors shadow-xs"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums font-mono text-[11px] bg-white/20 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
