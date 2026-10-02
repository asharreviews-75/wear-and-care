import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { X, Ruler, Heart, ShoppingBag, Check, ShieldCheck, Droplets, Wind, RotateCcw, ChevronDown } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onOpenSizeGuide: (product: Product, initialSize?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('traceability');

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[94vh] flex flex-col md:flex-row bg-[#FBFBF9] border border-[#E5E1D5] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#5A564E] hover:text-[#1A1A1A] bg-white/80 backdrop-blur-xs rounded-full border border-[#E5E1D7] transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Gallery & Visual Assets */}
        <div className="w-full md:w-1/2 bg-[#F3F0E8] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E4DA] overflow-y-auto">
          <div className="space-y-4">
            {/* Main Image Frame with Styled Fallback */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#ECE8DC] shadow-inner">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute top-3 left-3 bg-[#FAF8F4]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-[#4A473F] border border-[#E2DDD1]">
                {product.origin}
              </div>
            </div>

            {/* Thumbnail selector if secondary image exists */}
            {product.secondaryImage && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveImage(product.image)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === product.image ? 'border-[#1A1A1A]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.image} alt="Full view" className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage(product.secondaryImage!)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === product.secondaryImage ? 'border-[#1A1A1A]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={product.secondaryImage} alt="Craft detail" className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Environmental Savings Callout (Unboxed, clean metadata) */}
          <div className="mt-6 pt-4 border-t border-[#E4DFD4] grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#EAE5DC]">
              <div className="flex items-center justify-center gap-1 text-[#2C3E2D] mb-1">
                <Droplets className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-semibold tabular-nums">{product.metrics.waterSavedLiters} L</span>
              </div>
              <div className="text-[10px] text-[#706B62]">Water Conserved</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#EAE5DC]">
              <div className="flex items-center justify-center gap-1 text-[#2C3E2D] mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-semibold tabular-nums">{product.metrics.co2AvoidedKg} kg</span>
              </div>
              <div className="text-[10px] text-[#706B62]">CO₂ Offset</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#EAE5DC]">
              <div className="flex items-center justify-center gap-1 text-[#2C3E2D] mb-1">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-semibold tabular-nums">{product.metrics.circularityScore}/100</span>
              </div>
              <div className="text-[10px] text-[#706B62]">Circularity Index</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module & Story */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7A756B] mb-1.5">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.material.split('(')[0]}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] leading-tight">
                {product.name}
              </h1>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-xl font-mono tabular-nums font-semibold text-[#1A1A1A]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono tabular-nums text-[#8C877D] line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#2C3E2D] font-medium ml-1">
                  Tax included · Fair wages guaranteed
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#555047] leading-relaxed">
              {product.description}
            </p>

            {/* COLOR SELECTION */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#1A1A1A]">
                  Color Shade: <span className="font-normal text-[#6B665E]">{selectedColor.label}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`relative w-8 h-8 rounded-full border transition-all ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-[#1A1A1A] ring-offset-2 ring-offset-[#FBFBF9]'
                        : 'border-[#CCC7BD] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                    aria-label={`Select color ${c.label}`}
                  />
                ))}
              </div>
            </div>

            {/* SIZE SELECTION & INTEGRATED SIZE GUIDE LINK */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#1A1A1A]">Select Size</span>
                {/* DIRECT INTEGRATED SIZE GUIDE TRIGGER */}
                <button
                  type="button"
                  onClick={() => onOpenSizeGuide(product, selectedSize)}
                  className="flex items-center gap-1.5 text-[#2C3E2D] hover:text-[#182419] font-medium hover:underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Fit Guide (Calculator)</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      selectedSize === sz
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs'
                        : 'border-[#E4DFD5] bg-[#FAF8F5] text-[#3D3A34] hover:border-[#BBB5A7]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTIGUOUS PURCHASE ACTIONS */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E0DBD0] rounded-lg bg-white px-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-2 text-xs font-mono text-[#666259] hover:text-[#1A1A1A]"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono text-xs tabular-nums font-medium text-[#1A1A1A]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-2 text-xs font-mono text-[#666259] hover:text-[#1A1A1A]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Buy CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 text-xs tracking-wider uppercase font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs ${
                    addedAnimation
                      ? 'bg-[#2C3E2D] text-white'
                      : 'bg-[#1A1A1A] text-white hover:bg-[#333333]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ${(product.price * quantity).toFixed(0)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'border-[#945846] bg-[#FAF3F0] text-[#945846]'
                      : 'border-[#E0DBD0] bg-white text-[#666259] hover:text-[#1A1A1A]'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#6E695F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2C3E2D]" />
                <span>Includes free spare button pack & 100% natural fiber repair thread.</span>
              </div>
            </div>

            {/* ACCORDION MODULES (Transparency, Origin, Washing) */}
            <div className="border-t border-[#E8E4DA] pt-4 space-y-3">
              {/* Material & Certification */}
              <div className="border-b border-[#E8E4DA] pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('traceability')}
                  className="w-full flex items-center justify-between text-xs font-medium text-[#1A1A1A] text-left"
                >
                  <span>Materials & Production Traceability</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7A756B] transition-transform ${
                      activeAccordion === 'traceability' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'traceability' && (
                  <div className="pt-2 text-xs text-[#5C574E] space-y-2">
                    <p>{product.story}</p>
                    <div className="pt-1">
                      <span className="font-semibold text-[#1A1A1A]">Certification: </span>
                      <span>{product.metrics.certification}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#69655D]">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Care & Wash Accordion */}
              <div className="border-b border-[#E8E4DA] pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-xs font-medium text-[#1A1A1A] text-left"
                >
                  <span>Care, Laundry & Longevity</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7A756B] transition-transform ${
                      activeAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'care' && (
                  <div className="pt-2 text-xs text-[#5C574E] space-y-1.5 text-[11px]">
                    <div>
                      <span className="font-semibold text-[#1A1A1A]">Washing: </span>
                      {product.careInstructions.wash}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1A1A1A]">Drying: </span>
                      {product.careInstructions.dry}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1A1A1A]">Longevity Tip: </span>
                      {product.careInstructions.longevityTip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
