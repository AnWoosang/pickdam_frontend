// Query Keys for Review domain
export const reviewKeys = {
  all: ['review'] as const,
  reviews: (productId: string) => [...reviewKeys.all, 'product', productId] as const,
  review: (reviewId: string) => [...reviewKeys.all, reviewId] as const,
} as const;