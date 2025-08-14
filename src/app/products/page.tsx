import React, { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProductsPageClient } from '@/components/ProductsPageClient';

export default function ProductsPage() {
  return (
    <MainLayout showHeader={true} showFooter={true} showCategoryBar={true} showSearchBar={false}>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductsPageClient />
      </Suspense>
    </MainLayout>
  );
}