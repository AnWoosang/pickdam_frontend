'use client';

import { Suspense } from 'react';
import { SearchPage } from '@/features/search/components/searchPage';

function SearchContent() {
  return <SearchPage />;
}

export default function SearchPageRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}