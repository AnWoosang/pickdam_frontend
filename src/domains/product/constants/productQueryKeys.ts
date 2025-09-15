// Query Keys for Product domain
export const productKeys = {
  all: ['product'] as const,
  products: () => [...productKeys.all, 'products'] as const,
  product: (id: string) => [...productKeys.products(), id] as const,
  productsByCategory: (category: string) => [...productKeys.products(), 'category', category] as const,
  reviews: (productId: string) => [...productKeys.product(productId), 'reviews'] as const,
  priceHistory: (productId: string, days?: number) => [...productKeys.product(productId), 'price-history', days] as const,
}