import React, { Suspense } from 'react';
import { MainLayout } from '@/shared/layout/MainLayout';
import { ComingSoon } from '@/shared/components/ComingSoon';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

function EventsContent() {
  const eventIcon = (
    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    </div>
  );

  return (
    <MainLayout showHeader={true} showFooter={true} showCategoryBar={true} showSearchBar={false}>
      <ComingSoon 
        title="이벤트"
        description="다양한 할인 혜택과 특별 이벤트를 준비하고 있습니다."
        icon={eventIcon}
      />
    </MainLayout>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EventsContent />
    </Suspense>
  );
}