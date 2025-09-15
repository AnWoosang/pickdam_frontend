import { Suspense } from 'react';
import { MainLayout } from '@/shared/layout/MainLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { CommunityPage as CommunityPageComponent } from '@/domains/community/components/CommunityPage';

function CommunityContent() {
  return (
    <MainLayout showHeader={true} showFooter={false} showCategoryBar={true} showSearchBar={false}>
      <CommunityPageComponent />
    </MainLayout>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CommunityContent />
    </Suspense>
  );
}