export type Category = 'All' | 'Overshirts' | 'Knitwear' | 'Trousers' | 'Essentials';

export type SustainabilityTag = 'Organic Cotton' | 'European Flax Linen' | 'Recycled Merino' | 'Tencel Lyocell' | 'Botanical Dye';

export interface GarmentMeasurements {
  chest: number; // in cm
  length: number;
  shoulder?: number;
  waist?: number;
  inseam?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Overshirts' | 'Knitwear' | 'Trousers' | 'Essentials';
  price: number;
  originalPrice?: number;
  material: string;
  sustainabilityTags: SustainabilityTag[];
  metrics: {
    waterSavedLiters: number;
    co2AvoidedKg: number;
    circularityScore: number; // out of 100
    recycledContent: number; // percentage
    certification: string;
  };
  description: string;
  story: string;
  origin: string;
  details: string[];
  careInstructions: {
    wash: string;
    dry: string;
    iron: string;
    longevityTip: string;
  };
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: ProductColor[];
  inStock: boolean;
  image: string;
  secondaryImage?: string;
  fitType: 'Relaxed' | 'Tailored' | 'Regular';
  measurementsCm: Record<string, GarmentMeasurements>;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface OrderConfirmation {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  carbonOffset: number;
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  estimatedDelivery: string;
  waterSaved: number;
  co2Avoided: number;
}
