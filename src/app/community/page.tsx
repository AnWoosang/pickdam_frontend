import { Suspense } from 'react';
import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { CommunityPage as CommunityPageComponent } from '@/domains/community/components/CommunityPage';

function CommunityContent() {
  return (
    <ResponsiveLayout showHeader={true} showFooter={false} showCategoryBar={true} showSearchBar={false}>
      <CommunityPageComponent />
    </ResponsiveLayout>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CommunityContent />
    </Suspense>
  );
}