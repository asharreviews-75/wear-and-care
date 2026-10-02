import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { X, Search, ArrowRight, Ruler } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onOpenSizeGuide: (p: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onOpenSizeGuide,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.sustainabilityTags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#FBFBF9] border border-[#E5E0D5] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E4DA] bg-white gap-3">
          <Search className="w-5 h-5 text-[#858075]" />
          <input
            type="text"
            autoFocus
            placeholder="Search linen, recycled wool, organic trousers, sizes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-[#1A1A1A] placeholder-[#8E8A80]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8E8A80] hover:text-[#1A1A1A] px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#666259] hover:text-[#1A1A1A] rounded hover:bg-[#F2EFE8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Quick Searches */}
        {!query && (
          <div className="p-5 space-y-3">
            <div className="text-xs uppercase tracking-wider text-[#8A857A] font-medium">
              Popular Sustainable Inquiries
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Normandy Flax Linen', 'Recycled Merino', 'Tencel Lyocell', 'Wide-Leg Trousers', 'Size Guide'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-lg bg-[#F3EFE7] hover:bg-[#EAE4D8] text-[#4F4B43] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#736E64]">
                No garments found matching "{query}". Try searching for linen, wool, or trousers.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F3EFE7] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 rounded object-cover bg-[#EBE7DD]"
                    />
                    <div>
                      <div className="text-xs text-[#7A756C]">{item.category} · {item.material.split('(')[0]}</div>
                      <div className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#2C3E2D]">
                        {item.name}
                      </div>
                      <div className="text-xs font-mono text-[#5C574F] tabular-nums">
                        ${item.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSizeGuide(item);
                        onClose();
                      }}
                      className="p-1.5 text-xs text-[#2C3E2D] hover:bg-white rounded border border-[#E0DBCF]"
                      title="View size guide"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-[#8C877D] group-hover:text-[#1A1A1A] transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
