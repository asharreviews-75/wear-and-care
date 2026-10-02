import React from 'react';
import { Product } from '../types';
import { Heart, Ruler, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOpenSizeGuide: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onOpenSizeGuide,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div className="group relative flex flex-col bg-white border border-[#E9E5DC] rounded-xl overflow-hidden hover:border-[#D5CFBF] hover:-translate-y-0.5 transition-all duration-300 shadow-xs hover:shadow-md">
      {/* Visual Image Area (65%–75% of card visual balance) */}
      <div 
        className="relative aspect-[3/4] w-full bg-[#F5F2EA] overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />

        {/* Quiet Top Actions (Wishlist & Origin) */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
          <span className="text-[11px] font-medium tracking-wide text-[#3E3A33] bg-[#FAF8F3]/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-[#E5E0D4] pointer-events-auto">
            {product.origin.split(',')[0]}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors pointer-events-auto ${
              isWishlisted
                ? 'bg-white text-[#945846] shadow-sm'
                : 'bg-white/80 text-[#59554D] hover:text-[#1A1A1A] hover:bg-white'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Hover Strip */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 py-2 px-3 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A]/90 hover:bg-[#1A1A1A] text-white backdrop-blur-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Piece</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSizeGuide(product);
            }}
            className="py-2 px-3 text-xs font-medium bg-white/90 hover:bg-white text-[#1A1A1A] backdrop-blur-xs rounded-lg transition-colors flex items-center justify-center shadow-sm"
            title="Open Fit & Size Guide"
            aria-label="Open size guide for this product"
          >
            <Ruler className="w-3.5 h-3.5 text-[#2C3E2D]" />
          </button>
        </div>
      </div>

      {/* Product Content & Typography */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#787369] mb-1">
            <span className="uppercase tracking-wider text-[11px] font-medium">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[140px]">{product.material.split('(')[0]}</span>
          </div>

          <h3 
            onClick={() => onSelect(product)}
            className="text-base font-semibold text-[#1A1A1A] group-hover:text-[#2C3E2D] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#6B665E] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing and Eco Highlight */}
        <div className="pt-2 border-t border-[#F0ECE3] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-sm font-semibold text-[#1A1A1A]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono tabular-nums text-xs text-[#8E897E] line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#2C3E2D] font-mono tabular-nums flex items-center gap-1">
            <span>-{product.metrics.waterSavedLiters}L H₂O</span>
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              className="w-2.5 h-2.5 rounded-full border border-black/15"
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
          <span className="text-[11px] text-[#8C877E] ml-1">
            {product.colors.length} shades
          </span>
        </div>
      </div>
    </div>
  );
};
