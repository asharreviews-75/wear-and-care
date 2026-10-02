import React, { useState } from 'react';
import { CartItem, OrderConfirmation } from '../types';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Droplets, Wind, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onOrderComplete: (order: OrderConfirmation) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOrderComplete,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [includeCarbonOffset, setIncludeCarbonOffset] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

  // Checkout form
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    address: '42 Pine Street, Apt 3B',
    city: 'Portland',
    postalCode: '97201',
    country: 'United States',
  });

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 120;
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12;
  const carbonOffset = includeCarbonOffset ? 1.5 : 0;
  const total = subtotal + shipping + carbonOffset;

  // Environmental impact savings aggregation
  const totalWaterSaved = items.reduce((acc, item) => acc + item.product.metrics.waterSavedLiters * item.quantity, 0);
  const totalCo2Avoided = items.reduce((acc, item) => acc + item.product.metrics.co2AvoidedKg * item.quantity, 0);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: OrderConfirmation = {
      orderNumber: `WC-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      subtotal,
      shipping,
      carbonOffset,
      total,
      customer: { ...formData },
      estimatedDelivery: '3–5 business days (100% Carbon Neutral Transit)',
      waterSaved: totalWaterSaved,
      co2Avoided: Number(totalCo2Avoided.toFixed(1)),
    };
    onOrderComplete(order);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBF9] border-l border-[#E5E1D5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E4DA] bg-[#FAF8F3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1A1A1A]" />
              <h2 className="text-base font-serif font-semibold text-[#1A1A1A]">
                {isCheckingOut ? 'Eco-Conscious Checkout' : 'Your Shopping Bag'}
              </h2>
              <span className="text-xs font-mono text-[#777267] tabular-nums">
                ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#6B665E] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EBE7DC] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          {items.length > 0 && !isCheckingOut && (
            <div className="px-6 py-3 bg-[#F2EFE8] border-b border-[#E4E0D5] text-xs">
              <div className="flex justify-between text-[#5C574F] mb-1.5">
                <span>
                  {amountToFreeShipping === 0 ? (
                    <span className="text-[#2C3E2D] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complimentary carbon-neutral courier unlocked!
                    </span>
                  ) : (
                    <>Add <span className="font-mono font-medium text-[#1A1A1A]">${amountToFreeShipping}</span> more for free shipping</>
                  )}
                </span>
                <span className="font-mono tabular-nums text-[11px] text-[#787369]">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#DFD9CC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2C3E2D] transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-[#F3EFE7] flex items-center justify-center text-[#827D73]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-[#1A1A1A]">Your bag is currently empty</h3>
                  <p className="text-xs text-[#706B62] max-w-xs">
                    Invest in timeless, earth-first garments designed to be worn for decades and repaired for life.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : isCheckingOut ? (
              /* CHECKOUT FORM VIEW */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">
                    Delivery Information
                  </h3>

                  <div>
                    <label className="block text-[11px] text-[#69655D] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#69655D] mb-1">Email (for tree-planting receipt)</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#69655D] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs focus:outline-none focus:border-[#2C3E2D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#69655D] mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#69655D] mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E0DBD0] rounded-lg text-xs focus:outline-none focus:border-[#2C3E2D]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Option */}
                <div className="pt-3 border-t border-[#E8E4DA] space-y-2">
                  <h3 className="font-semibold text-xs tracking-wider uppercase text-[#1A1A1A]">
                    Payment Mode
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#2C3E2D] bg-[#F2F5F2] text-[#1A1A1A]'
                          : 'border-[#E0DBD0] bg-white text-[#666259]'
                      }`}
                    >
                      <div className="font-medium text-xs">Zero-Fee Digital</div>
                      <div className="text-[10px] text-[#7A756C] mt-0.5">Card / Apple Pay</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#2C3E2D] bg-[#F2F5F2] text-[#1A1A1A]'
                          : 'border-[#E0DBD0] bg-white text-[#666259]'
                      }`}
                    >
                      <div className="font-medium text-xs">Pay on Courier (COD)</div>
                      <div className="text-[10px] text-[#7A756C] mt-0.5">Zero risk verification</div>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ITEM LIST VIEW */
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl bg-white border border-[#E9E5DC] shadow-xs"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F3EFE8] shrink-0 border border-[#EAE6DE]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-[#1A1A1A] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="font-mono tabular-nums text-xs font-semibold text-[#1A1A1A] ml-2">
                            ${(item.product.price * item.quantity).toFixed(0)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#736E65] mt-1">
                          <span>Size: <strong className="text-[#1A1A1A]">{item.size}</strong></span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            <span>{item.color.label}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#E2DDD2] rounded-md bg-[#FAF9F6]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-mono text-[#66625A] hover:text-[#1A1A1A]"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-xs tabular-nums font-medium text-[#1A1A1A]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-mono text-[#66625A] hover:text-[#1A1A1A]"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#969186] hover:text-[#945846] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ECOLOGICAL IMPACT SUMMARY */}
                <div className="p-4 rounded-xl bg-[#F0EDE4] border border-[#E2DDCF] space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-[#2C3E2D]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ecological Footprint Saved</span>
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider">Zero Slop Certified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-[#2C3E2D]" />
                      <div>
                        <div className="font-mono font-semibold tabular-nums text-[#1A1A1A]">
                          {totalWaterSaved.toLocaleString()} L
                        </div>
                        <div className="text-[10px] text-[#736F66]">Clean Water Saved</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-[#2C3E2D]" />
                      <div>
                        <div className="font-mono font-semibold tabular-nums text-[#1A1A1A]">
                          {totalCo2Avoided.toFixed(1)} kg
                        </div>
                        <div className="text-[10px] text-[#736F66]">Atmospheric CO₂ Avoided</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARBON OFFSET ADDON */}
                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E8E4DA] bg-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCarbonOffset}
                    onChange={(e) => setIncludeCarbonOffset(e.target.checked)}
                    className="mt-0.5 rounded text-[#2C3E2D] focus:ring-[#2C3E2D]"
                  />
                  <div className="text-xs">
                    <div className="font-medium text-[#1A1A1A] flex justify-between">
                      <span>Soil Regeneration & Tree Planting</span>
                      <span className="font-mono tabular-nums text-[#2C3E2D]">+$1.50</span>
                    </div>
                    <div className="text-[11px] text-[#757067] mt-0.5">
                      Contributes directly to regenerative agroforestry restoring degraded soil.
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* FOOTER TOTALS & BUY BUTTON */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E4DA] bg-[#FAF8F3] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B665E]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B665E]">
                  <span>Carbon-Neutral Delivery</span>
                  <span className="font-mono tabular-nums text-[#1A1A1A]">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {includeCarbonOffset && (
                  <div className="flex justify-between text-[#6B665E]">
                    <span>Soil Regeneration Partner</span>
                    <span className="font-mono tabular-nums text-[#1A1A1A]">$1.50</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#EBE7DC] flex justify-between text-sm font-semibold text-[#1A1A1A]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {isCheckingOut ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="px-4 py-3 text-xs font-medium text-[#5E5950] hover:text-[#1A1A1A] border border-[#E0DBD0] rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex-1 py-3 text-xs tracking-wider uppercase font-medium bg-[#2C3E2D] text-white hover:bg-[#1E2B1F] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Confirm Order · ${total.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 text-xs tracking-wider uppercase font-medium bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
