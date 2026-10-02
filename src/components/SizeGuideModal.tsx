import React, { useState } from 'react';
import { Product } from '../types';
import { X, Ruler, Sparkles, Check, HelpCircle, ArrowRight } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSelectSize?: (size: string) => void;
  initialSelectedSize?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  product,
  onSelectSize,
  initialSelectedSize,
}) => {
  const [activeTab, setActiveTab] = useState<'recommender' | 'chart' | 'garment' | 'how-to'>('recommender');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  // Recommender inputs
  const [height, setHeight] = useState<number>(178); // cm
  const [weight, setWeight] = useState<number>(74); // kg
  const [fitPreference, setFitPreference] = useState<'snug' | 'regular' | 'relaxed'>('regular');
  const [recommendedSize, setRecommendedSize] = useState<string>('M');
  const [confidence, setConfidence] = useState<number>(94);

  // Compute recommendation
  const calculateRecommendation = (h: number, w: number, fit: 'snug' | 'regular' | 'relaxed') => {
    // Basic BMI and volumetric estimate for fashion sizing
    // standard M is around 175-182cm, 70-78kg
    let baseScore = (h - 170) * 0.4 + (w - 70) * 0.6;
    if (fit === 'snug') baseScore -= 5;
    if (fit === 'relaxed') baseScore += 5;

    let size = 'M';
    if (baseScore < -12) size = 'XS';
    else if (baseScore < -4) size = 'S';
    else if (baseScore <= 5) size = 'M';
    else if (baseScore <= 14) size = 'L';
    else if (baseScore <= 22) size = 'XL';
    else size = 'XXL';

    // Verify if size exists in product
    if (product && !product.sizes.includes(size as any)) {
      if (product.sizes.includes('M' as any)) size = 'M';
      else size = product.sizes[0];
    }

    setRecommendedSize(size);
    setConfidence(Math.min(97, 88 + Math.round(Math.abs(baseScore % 9))));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    calculateRecommendation(val, weight, fitPreference);
  };

  const handleWeightChange = (val: number) => {
    setWeight(val);
    calculateRecommendation(height, val, fitPreference);
  };

  const handleFitChange = (fit: 'snug' | 'regular' | 'relaxed') => {
    setFitPreference(fit);
    calculateRecommendation(height, weight, fit);
  };

  if (!isOpen) return null;

  // Convert values for display
  const toUnit = (cmVal: number) => {
    if (unit === 'cm') return `${cmVal} cm`;
    const inches = (cmVal / 2.54).toFixed(1);
    return `${inches}"`;
  };

  // Standard Body Chart
  const standardBodyChart = [
    { size: 'XS', chest: [84, 89], waist: [68, 73], hips: [86, 91], height: '162-170 cm' },
    { size: 'S', chest: [90, 95], waist: [74, 79], hips: [92, 97], height: '168-175 cm' },
    { size: 'M', chest: [96, 103], waist: [80, 86], hips: [98, 104], height: '174-182 cm' },
    { size: 'L', chest: [104, 111], waist: [87, 94], hips: [105, 112], height: '180-188 cm' },
    { size: 'XL', chest: [112, 119], waist: [95, 103], hips: [113, 120], height: '185-192 cm' },
    { size: 'XXL', chest: [120, 128], waist: [104, 112], hips: [121, 128], height: '188-196 cm' },
  ];

  const handleApplySize = (size: string) => {
    if (onSelectSize) {
      onSelectSize(size);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FBFBF9] border border-[#E4E0D5] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE7DC] bg-[#FAF8F3]">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#736E65] font-medium">
              <Ruler className="w-3.5 h-3.5 text-[#2C3E2D]" />
              <span>Precision Tailoring Guide</span>
              {product && (
                <>
                  <span>·</span>
                  <span className="text-[#1A1A1A] font-medium">{product.name}</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mt-0.5">
              Find Your Sustainable Fit
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Unit Toggle */}
            <div className="flex items-center p-0.5 bg-[#EAE6DC] rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  unit === 'cm' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#69655D] hover:text-[#1A1A1A]'
                }`}
              >
                Metric (cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  unit === 'in' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#69655D] hover:text-[#1A1A1A]'
                }`}
              >
                Imperial (in)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#69655D] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EBE7DC] transition-colors"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EBE7DC] px-6 bg-[#FAF8F3] gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('recommender')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'recommender'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Smart Fit Advisor
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'chart'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            Body Measurements
          </button>
          {product && (
            <button
              onClick={() => setActiveTab('garment')}
              className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'garment'
                  ? 'border-[#2C3E2D] text-[#1A1A1A]'
                  : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
              }`}
            >
              Garment Specs (Flat)
            </button>
          )}
          <button
            onClick={() => setActiveTab('how-to')}
            className={`py-3 text-xs tracking-wider uppercase font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'how-to'
                ? 'border-[#2C3E2D] text-[#1A1A1A]'
                : 'border-transparent text-[#757168] hover:text-[#1A1A1A]'
            }`}
          >
            How To Measure
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SMART FIT RECOMMENDER */}
          {activeTab === 'recommender' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[#F3EFE6] border border-[#E5E0D3] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#2C3E2D] shrink-0 mt-0.5" />
                <div className="text-xs text-[#524E46] leading-relaxed">
                  <span className="font-semibold text-[#1A1A1A]">Zero Return Philosophy: </span>
                  Over 40% of standard online apparel returns end up in landfills. Our circular fit algorithm calculates your exact silhouette ease to ensure your Wear & Care garment fits naturally on the first try.
                </div>
              </div>

              {/* Sliders & Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-[#E9E5DC]">
                {/* Height */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="height-slider" className="font-medium text-[#1A1A1A]">Your Height</label>
                    <span className="tabular-nums font-mono text-[#2C3E2D] font-medium">
                      {unit === 'cm'
                        ? `${height} cm`
                        : `${Math.floor(height / 30.48)}' ${Math.round((height % 30.48) / 2.54)}"`}
                    </span>
                  </div>
                  <input
                    id="height-slider"
                    type="range"
                    min="150"
                    max="205"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E6E1D5] rounded-lg appearance-none cursor-pointer accent-[#2C3E2D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8C887E]">
                    <span>150 cm</span>
                    <span>175 cm</span>
                    <span>205 cm</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="weight-slider" className="font-medium text-[#1A1A1A]">Your Weight</label>
                    <span className="tabular-nums font-mono text-[#2C3E2D] font-medium">
                      {unit === 'cm' ? `${weight} kg` : `${Math.round(weight * 2.20462)} lbs`}
                    </span>
                  </div>
                  <input
                    id="weight-slider"
                    type="range"
                    min="45"
                    max="125"
                    value={weight}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E6E1D5] rounded-lg appearance-none cursor-pointer accent-[#2C3E2D]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8C887E]">
                    <span>45 kg</span>
                    <span>85 kg</span>
                    <span>125 kg</span>
                  </div>
                </div>

                {/* Fit Preference */}
                <div className="md:col-span-2 space-y-2 pt-2 border-t border-[#F0ECE4]">
                  <label className="text-xs font-medium text-[#1A1A1A] block">
                    Preferred Fit Aesthetic
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleFitChange('snug')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                        fitPreference === 'snug'
                          ? 'border-[#2C3E2D] bg-[#2C3E2D] text-white shadow-xs'
                          : 'border-[#E4DFD5] bg-[#FAF8F5] text-[#555047] hover:border-[#CDC7BB]'
                      }`}
                    >
                      <div className="font-semibold">Tailored / Closer</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Minimal ease</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFitChange('regular')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                        fitPreference === 'regular'
                          ? 'border-[#2C3E2D] bg-[#2C3E2D] text-white shadow-xs'
                          : 'border-[#E4DFD5] bg-[#FAF8F5] text-[#555047] hover:border-[#CDC7BB]'
                      }`}
                    >
                      <div className="font-semibold">True to Size</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Classic drape</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFitChange('relaxed')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                        fitPreference === 'relaxed'
                          ? 'border-[#2C3E2D] bg-[#2C3E2D] text-white shadow-xs'
                          : 'border-[#E4DFD5] bg-[#FAF8F5] text-[#555047] hover:border-[#CDC7BB]'
                      }`}
                    >
                      <div className="font-semibold">Relaxed / Slouchy</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Generous drape</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="p-6 rounded-xl bg-[#FAF8F4] border border-[#E2DDD1] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs uppercase tracking-wider text-[#6B665D] font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <span>Optimal Recommended Size</span>
                    <span className="text-[#2C3E2D] font-semibold tabular-nums">({confidence}% Match)</span>
                  </div>
                  <div className="flex items-baseline justify-center sm:justify-start gap-3">
                    <span className="text-4xl font-serif font-bold text-[#1A1A1A]">{recommendedSize}</span>
                    <span className="text-xs text-[#5C574F]">
                      {product?.fitType || 'Relaxed'} silhouette tailored for clean everyday movement
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6B62] pt-1 max-w-md">
                    Based on your height ({height} cm) and weight ({weight} kg) with a {fitPreference} fit, size {recommendedSize} gives comfortable shoulder mobility and proper length.
                  </p>
                </div>

                {onSelectSize && (
                  <button
                    type="button"
                    onClick={() => handleApplySize(recommendedSize)}
                    className="w-full sm:w-auto px-5 py-3 text-xs tracking-wider uppercase font-medium bg-[#2C3E2D] text-white hover:bg-[#1E2B1F] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
                  >
                    <span>Select Size {recommendedSize}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STANDARD BODY MEASUREMENTS */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B665E]">
                All measurements refer to body measurements. Use a soft tailor tape measure to check your perimeter.
              </p>
              <div className="overflow-x-auto rounded-lg border border-[#E6E1D7] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F4] border-b border-[#E6E1D7] text-[#555047] uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Size</th>
                      <th className="py-3 px-4 font-semibold">Chest / Bust</th>
                      <th className="py-3 px-4 font-semibold">Natural Waist</th>
                      <th className="py-3 px-4 font-semibold">Low Hip</th>
                      <th className="py-3 px-4 font-semibold">Height Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4] text-[#2D2A26]">
                    {standardBodyChart.map((row) => {
                      const isRecommended = row.size === recommendedSize;
                      return (
                        <tr
                          key={row.size}
                          className={`hover:bg-[#F9F7F2] transition-colors ${
                            isRecommended ? 'bg-[#F2ECE0]/60 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 flex items-center gap-2">
                            <span className="font-bold">{row.size}</span>
                            {isRecommended && (
                              <span className="text-[10px] text-[#2C3E2D] font-semibold bg-[#E4DCB] px-1.5 py-0.5 rounded">
                                Recommended
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums">
                            {unit === 'cm'
                              ? `${row.chest[0]} - ${row.chest[1]} cm`
                              : `${(row.chest[0] / 2.54).toFixed(1)}" - ${(row.chest[1] / 2.54).toFixed(1)}"`}
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums">
                            {unit === 'cm'
                              ? `${row.waist[0]} - ${row.waist[1]} cm`
                              : `${(row.waist[0] / 2.54).toFixed(1)}" - ${(row.waist[1] / 2.54).toFixed(1)}"`}
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums">
                            {unit === 'cm'
                              ? `${row.hips[0]} - ${row.hips[1]} cm`
                              : `${(row.hips[0] / 2.54).toFixed(1)}" - ${(row.hips[1] / 2.54).toFixed(1)}"`}
                          </td>
                          <td className="py-3 px-4 text-[#666259]">{row.height}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GARMENT SPECIFICATIONS (FLAT MEASUREMENTS) */}
          {activeTab === 'garment' && product && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#FAF8F4] border border-[#E6E1D7] text-xs text-[#555047] space-y-1">
                <div className="font-semibold text-[#1A1A1A]">Measuring Your Existing Favorite Garment</div>
                <div>
                  To find your ideal match, lay your best-fitting garment flat on a table and measure across the seam points. Compare below:
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#E6E1D7] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F4] border-b border-[#E6E1D7] text-[#555047] uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Size</th>
                      {Boolean(product?.measurementsCm?.['M']?.chest && product.measurementsCm['M'].chest > 0) && <th className="py-3 px-4 font-semibold">Chest (Pit-to-Pit x2)</th>}
                      {Boolean(product?.measurementsCm?.['M']?.shoulder) && <th className="py-3 px-4 font-semibold">Shoulder Width</th>}
                      {Boolean(product?.measurementsCm?.['M']?.waist) && <th className="py-3 px-4 font-semibold">Waistband (Flat x2)</th>}
                      {Boolean(product?.measurementsCm?.['M']?.inseam) && <th className="py-3 px-4 font-semibold">Inseam</th>}
                      <th className="py-3 px-4 font-semibold">Back Length</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE4] text-[#2D2A26]">
                    {Object.entries(product?.measurementsCm || {}).map(([sz, m]) => (
                      <tr key={sz} className="hover:bg-[#F9F7F2] transition-colors">
                        <td className="py-3 px-4 font-bold">{sz}</td>
                        {Boolean(m.chest && m.chest > 0) && <td className="py-3 px-4 font-mono tabular-nums">{toUnit(m.chest)}</td>}
                        {m.shoulder !== undefined && <td className="py-3 px-4 font-mono tabular-nums">{toUnit(m.shoulder)}</td>}
                        {m.waist !== undefined && <td className="py-3 px-4 font-mono tabular-nums">{toUnit(m.waist)}</td>}
                        {m.inseam !== undefined && <td className="py-3 px-4 font-mono tabular-nums">{toUnit(m.inseam)}</td>}
                        <td className="py-3 px-4 font-mono tabular-nums">{toUnit(m.length)}</td>
                        <td className="py-3 px-4 text-right">
                          {onSelectSize && (
                            <button
                              type="button"
                              onClick={() => handleApplySize(sz)}
                              className="text-xs text-[#2C3E2D] font-medium hover:underline"
                            >
                              Choose {sz}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO MEASURE */}
          {activeTab === 'how-to' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#524E46]">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D7] space-y-2">
                  <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#2C3E2D] flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <span>Chest & Bust</span>
                  </div>
                  <p className="leading-relaxed text-[#615C53]">
                    Wrap the measuring tape horizontally around the fullest part of your chest, keeping it level across your shoulder blades under your armpits. Breathe normally.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E6E1D7] space-y-2">
                  <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#2C3E2D] flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <span>Natural Waist</span>
                  </div>
                  <p className="leading-relaxed text-[#615C53]">
                    Locate the narrowest point of your torso (typically 2–3 cm above your navel). Keep one finger between your body and the tape for an easy drape.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D7] space-y-2">
                  <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#2C3E2D] flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <span>Hips</span>
                  </div>
                  <p className="leading-relaxed text-[#615C53]">
                    Stand with your feet together and measure around the fullest curve of your hips and seat, keeping the tape parallel to the floor.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E6E1D7] space-y-2">
                  <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EAE6DC] text-[#2C3E2D] flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <span>Garment Length</span>
                  </div>
                  <p className="leading-relaxed text-[#615C53]">
                    For tops and jackets, measure from the highest point of the shoulder seam straight down to the bottom hem.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EBE7DC] bg-[#FAF8F3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F6B62] gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2C3E2D]" />
            <span>Need personalized tailoring advice? We provide free fit consultations.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#EBE7DC] rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
