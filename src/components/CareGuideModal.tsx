import React, { useState } from 'react';
import { X, Sparkles, Feather, Droplets, Sun, Scissors, Check, Send } from 'lucide-react';

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'habits' | 'stains' | 'repair' | 'circularity'>('habits');
  const [repairRequestSent, setRepairRequestSent] = useState(false);
  const [repairItem, setRepairItem] = useState('');
  const [repairEmail, setRepairEmail] = useState('');

  if (!isOpen) return null;

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairEmail) return;
    setRepairRequestSent(true);
    setTimeout(() => {
      setRepairRequestSent(false);
      setRepairItem('');
      setRepairEmail('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FBFBF9] border border-[#E4E0D5] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE7DC] bg-[#FAF8F3]">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#736E65] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#2C3E2D]" />
              <span>Garment Longevity Manual</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mt-0.5">
              The Care Standard
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#69655D] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EBE7DC] transition-colors"
            aria-label="Close care guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-[#EBE7DC] px-6 bg-[#FAF8F3] gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('habits')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'habits'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Low-Impact Laundry
          </button>
          <button
            onClick={() => setActiveTab('stains')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'stains'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Natural Stain Remedies
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'repair'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Mending & Free Repair Kit
          </button>
          <button
            onClick={() => setActiveTab('circularity')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'circularity'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Circular Take-Back
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LOW-IMPACT LAUNDRY */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#F1EDE4] border border-[#E3DDD1] text-xs text-[#524E46] leading-relaxed">
                <span className="font-semibold text-[#1A1A1A]">Up to 70% of a garment’s lifecycle emissions occur after purchase</span> during washing and machine drying. Changing how you care for clothes doubles their lifespan while cutting personal carbon impact by half.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-[#E7E2D7] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] flex items-center justify-center text-[#2C3E2D]">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Wash Cold at 30°C / 85°F</h4>
                  <p className="text-xs text-[#635F56] leading-relaxed">
                    Cold water protects natural fiber tensile strength, prevents botanical dye fading, and consumes 90% less electricity than hot cycles.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#E7E2D7] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] flex items-center justify-center text-[#2C3E2D]">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Skip the Tumble Dryer</h4>
                  <p className="text-xs text-[#635F56] leading-relaxed">
                    Tumble dry heat breaks organic flax and cotton strands, creating micro-lint. Hang dry in shade to preserve crisp silhouettes and natural handfeel.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#E7E2D7] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] flex items-center justify-center text-[#2C3E2D]">
                    <Feather className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Aerate Merino & Linen</h4>
                  <p className="text-xs text-[#635F56] leading-relaxed">
                    Pure merino wool and flax contain natural lanolin and hollow cell chambers that naturally repel odor bacteria. Hang outside for 2 hours between wears instead of frequent laundering.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#E7E2D7] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] flex items-center justify-center text-[#2C3E2D]">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Steam Over Ironing</h4>
                  <p className="text-xs text-[#635F56] leading-relaxed">
                    Direct heavy iron plates flatten natural weave slubs and scorch fibers. Steaming relaxes fibers naturally and refreshes clothes without water submersion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NATURAL STAIN REMEDIES */}
          {activeTab === 'stains' && (
            <div className="space-y-4">
              <p className="text-xs text-[#635F56]">
                Avoid harsh petrochemical bleach and optical brighteners. These traditional kitchen remedies lift stains gently without stripping botanical dyes:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A1A]">Coffee & Tea Stains</span>
                    <span className="text-[11px] font-mono text-[#2C3E2D]">White Vinegar + Warm Water</span>
                  </div>
                  <p className="text-xs text-[#635F56]">
                    Dab (never rub) with a solution of 1 part distilled white vinegar and 2 parts warm water. Blot with a clean undyed cloth until color transfers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A1A]">Oil & Grease Marks</span>
                    <span className="text-[11px] font-mono text-[#2C3E2D]">Baking Soda or Arrowroot</span>
                  </div>
                  <p className="text-xs text-[#635F56]">
                    Sprinkle dry baking soda directly onto the mark immediately. Let sit for 30 minutes to absorb excess lipids before brushing off and washing cold.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A1A]">Red Wine & Botanical Juice</span>
                    <span className="text-[11px] font-mono text-[#2C3E2D]">Coarse Salt + Cold Sparkling Water</span>
                  </div>
                  <p className="text-xs text-[#635F56]">
                    Coat immediately in salt to draw out the tannins. Flush thoroughly from the underside of the fabric with cold carbonated water.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REPAIR & FREE REPAIR KIT */}
          {activeTab === 'repair' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#FAF8F4] border border-[#E4DFD3] flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EBE6DB] flex items-center justify-center text-[#2C3E2D] shrink-0">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">Free Lifetime Mending Guarantee</h4>
                  <p className="text-xs text-[#666158] mt-0.5">
                    Every seam failure, loose button, or worn hem on any Wear & Care piece is repaired for free in our atelier. Or request an exact matching repair thread & corozo button pack shipped to your door for free.
                  </p>
                </div>
              </div>

              {/* Request Form */}
              <div className="p-5 rounded-xl bg-white border border-[#E7E2D7]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">
                  Request Free Mending Supplies or Atelier Booking
                </h4>

                {repairRequestSent ? (
                  <div className="p-4 rounded-lg bg-[#EBF2EB] border border-[#CDE0CD] flex items-center gap-3 text-xs text-[#2A472B]">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Your request has been received. Our mending atelier will dispatch your complimentary thread kit and return label within 24 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRepairSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#524E46] mb-1">
                          Garment Name / Style
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Flaxen Chore Overshirt in Sand"
                          value={repairItem}
                          onChange={(e) => setRepairItem(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E0DBCF] rounded-lg focus:outline-none focus:border-[#2C3E2D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#524E46] mb-1">
                          Your Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your.name@example.com"
                          value={repairEmail}
                          onChange={(e) => setRepairEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E0DBCF] rounded-lg focus:outline-none focus:border-[#2C3E2D]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 text-xs font-medium bg-[#2C3E2D] text-white hover:bg-[#1E2B1F] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Free Mending Pack</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CIRCULAR TAKE-BACK */}
          {activeTab === 'circularity' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#FAF8F3] border border-[#E6E1D7] space-y-2">
                <h4 className="text-sm font-semibold text-[#1A1A1A]">The 100% Circular Guarantee</h4>
                <p className="text-xs text-[#635F56] leading-relaxed">
                  When a Wear & Care garment reaches the end of its wearable life after years of service, return it to us. Because we use mono-materials with zero blended synthetic polymers, we mechanically re-spin the fibers into new yarn for upcoming collections.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#2C3E2D] font-medium">
                  <Check className="w-4 h-4" />
                  <span>Receive 20% circular store credit for every returned garment.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#524E46]">
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] text-center space-y-1">
                  <div className="font-serif text-lg font-bold text-[#1A1A1A]">01. Wear Fully</div>
                  <p className="text-[11px] text-[#787369]">Wear, patch, and repair with our lifetime kits</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] text-center space-y-1">
                  <div className="font-serif text-lg font-bold text-[#1A1A1A]">02. Return Free</div>
                  <p className="text-[11px] text-[#787369]">Print a prepaid biodegradable return pouch</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E7E2D7] text-center space-y-1">
                  <div className="font-serif text-lg font-bold text-[#1A1A1A]">03. Re-Spun Yarn</div>
                  <p className="text-[11px] text-[#787369]">Garment is unraveled and spun into new knitwear</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EBE7DC] bg-[#FAF8F3] flex justify-between items-center text-xs text-[#706B62]">
          <span>Wear & Care Atelier · 100% Renewable Energy Certified</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-[#1A1A1A] hover:bg-[#EBE7DC] rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
