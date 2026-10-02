import React from 'react';
import { Product } from '../types';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#FBFBF9] border border-[#E5E0D5] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#E8E4DA] bg-[#FAF8F3] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#945846] fill-current" />
            <h2 className="text-base font-serif font-semibold text-[#1A1A1A]">
              Your Saved Garments
            </h2>
            <span className="text-xs font-mono text-[#787369]">({wishlist.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6B665E] hover:text-[#1A1A1A] rounded hover:bg-[#EBE7DC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {wishlist.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-[#C7C2B6] mx-auto stroke-1" />
              <p className="text-xs text-[#706B62]">
                You haven't saved any garments yet. Click the heart icon on any piece to save it for future consideration.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EBE7DC] shadow-2xs"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer group flex-1"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 rounded object-cover bg-[#F2EEE6]"
                    />
                    <div>
                      <div className="text-[11px] text-[#78736A] uppercase tracking-wide">
                        {item.category}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#1A1A1A] group-hover:text-[#2C3E2D]">
                        {item.name}
                      </div>
                      <div className="text-xs font-mono font-medium text-[#1A1A1A] tabular-nums mt-0.5">
                        ${item.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromWishlist(item)}
                      className="p-2 text-[#9E9A90] hover:text-[#945846] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
