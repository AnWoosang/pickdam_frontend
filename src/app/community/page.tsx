import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityPage as CommunityPageComponent } from '@/features/community/components/list/CommunityPage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function CommunityPage() {
  return (
    <MainLayout showHeader={true} showFooter={false} showCategoryBar={true} showSearchBar={false}>
      <Suspense fallback={<LoadingSpinner />}>
        <CommunityPageComponent />
      </Suspense>
    </MainLayout>
  );
}