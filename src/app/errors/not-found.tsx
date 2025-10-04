import React from 'react';
import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { ErrorPage } from '@/shared/components/ErrorPage';

export default function NotFound() {
  return (
    <ResponsiveLayout showHeader={true} showFooter={true} showCategoryBar={false} showSearchBar={false}>
      <ErrorPage
        statusCode={404}
        showBackButton={true}
        showHomeButton={true}
        showRefreshButton={false}
      />
    </ResponsiveLayout>
  );
}