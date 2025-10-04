import React, { Suspense } from 'react';
import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProductDetailPage } from '@/domains/product/components/detail/ProductDetailPage';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  return (
    <ResponsiveLayout showHeader={true} showFooter={true} showCategoryBar={true} showSearchBar={false}>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetailPage productId={id} />
      </Suspense>
    </ResponsiveLayout>
  );
}

