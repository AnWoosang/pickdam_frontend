import React, { Suspense } from 'react';
import { MainLayout } from '@/shared/layout/MainLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProductListPage } from '@/domains/product/components/ProductListPage';

export default function ProductsPage() {
  return (
    <MainLayout showHeader={true} showFooter={true} showCategoryBar={true} showSearchBar={false}>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductListPage />
      </Suspense>
    </MainLayout>
  );
}