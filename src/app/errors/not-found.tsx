import React from 'react';
import { MainLayout } from '@/shared/layout/MainLayout';
import { ErrorPage } from '@/shared/components/ErrorPage';

export default function NotFound() {
  return (
    <MainLayout showHeader={true} showFooter={true} showCategoryBar={false} showSearchBar={false}>
      <ErrorPage 
        statusCode={404}
        showBackButton={true}
        showHomeButton={true}
        showRefreshButton={false}
      />
    </MainLayout>
  );
}