"use client";

import { Suspense, useEffect } from 'react';
import { MainLayout } from '@/shared/layout/MainLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { MainPage } from '@/domains/home/components/MainPage';
import { perf } from '@/utils/performance';

function HomeContent() {
  useEffect(() => {
    perf.start('HomePage-Total');
    return () => perf.end('HomePage-Total');
  }, []);

  return (
    <MainLayout showHeader={true} showFooter={true} disableContainer={true}>
      <MainPage />
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}