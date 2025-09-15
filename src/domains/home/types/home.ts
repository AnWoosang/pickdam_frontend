import type { Product } from '@/domains/product/types/product';

export interface HomeData {
  bestSellers: Product[];
  popularProducts: Product[];
}