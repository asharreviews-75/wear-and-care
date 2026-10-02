import React from 'react';
import { OrderConfirmation } from '../types';
import { Check, X, Droplets, Wind, PackageCheck, HeartHandshake } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: OrderConfirmation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#FBFBF9] border border-[#E5E1D5] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6E6A62] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EFEBE3] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#EAF0EA] text-[#2C3E2D] flex items-center justify-center mx-auto">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="text-xs uppercase tracking-widest text-[#726E65] font-medium">
            Order Confirmed · Preparing Shipment
          </div>
          <h2 className="text-2xl font-serif text-[#1A1A1A]">
            Thank You, {order.customer.name.split(' ')[0]}
          </h2>
          <div className="text-xs font-mono text-[#524E46] bg-[#F1EDE4] px-3 py-1.5 rounded-md inline-block">
            Order Reference: {order.orderNumber}
          </div>
        </div>

        {/* Environmental Proof adjacent to order */}
        <div className="p-4 rounded-xl bg-[#F0EDE3] border border-[#E0DBCF] space-y-2">
          <div className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-[#2C3E2D]" />
            <span>Tangible Impact of This Order</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#2C3E2D]" />
              <div>
                <span className="font-mono tabular-nums font-bold text-[#1A1A1A]">
                  {order.waterSaved.toLocaleString()} Liters
                </span>
                <p className="text-[10px] text-[#716C63]">Clean water conserved</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#2C3E2D]" />
              <div>
                <span className="font-mono tabular-nums font-bold text-[#1A1A1A]">
                  {order.co2Avoided} kg
                </span>
                <p className="text-[10px] text-[#716C63]">CO₂ avoided from virgin crops</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-3 text-xs">
          <div className="font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">
            Purchased Garments
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1 border-b border-[#F0EBE0]">
                <div>
                  <div className="font-medium text-[#1A1A1A]">{item.product.name}</div>
                  <div className="text-[11px] text-[#78736A]">
                    Size {item.size} · {item.color.label} · Qty {item.quantity}
                  </div>
                </div>
                <div className="font-mono tabular-nums font-medium text-[#1A1A1A]">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1 text-[#666258]">
            <div className="flex justify-between">
              <span>Transit Method</span>
              <span className="text-[#1A1A1A]">{order.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping to</span>
              <span className="text-[#1A1A1A]">{order.customer.city}, {order.customer.country}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#1A1A1A] text-sm pt-2 border-t border-[#EAE5DB]">
              <span>Amount Paid</span>
              <span className="font-mono tabular-nums">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E7E2D6] text-[11px] text-[#69655C] flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#2C3E2D] shrink-0" />
          <span>A free mending kit with matching thread and corozo buttons has been included in your biodegradable mailer box.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
};
