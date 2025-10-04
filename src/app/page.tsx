"use client";

import { Suspense } from 'react';
import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { MainPage } from '@/domains/home/components/MainPage';
function HomeContent() {
  return (
    <ResponsiveLayout showHeader={true} showFooter={true} disableContainer={true}>
      <MainPage />
    </ResponsiveLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}