import React, { Suspense } from 'react';
import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProductListPage } from '@/domains/product/components/ProductListPage';

export default function ProductsPage() {
  return (
    <ResponsiveLayout showHeader={true} showFooter={true} showCategoryBar={true} showSearchBar={false}>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductListPage />
      </Suspense>
    </ResponsiveLayout>
  );
}