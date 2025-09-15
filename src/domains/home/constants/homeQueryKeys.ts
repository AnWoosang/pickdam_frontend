// Query Keys
export const homeKeys = {
  all: ['home'] as const,
  bestSellers: (limit?: number) => [...homeKeys.all, 'bestSellers', limit] as const,
  popularProducts: (limit?: number) => [...homeKeys.all, 'popularProducts', limit] as const,
  homeData: () => [...homeKeys.all, 'data'] as const,
};