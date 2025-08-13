import { MainLayout } from '@/components/layout/mainLayout';
import { CommunityPage as CommunityPageComponent } from '@/features/community/components/communityPage';

export default function CommunityPage() {
  return (
    <MainLayout showHeader={true} showFooter={true} showCategoryBar={false} showSearchBar={false}>
      <div className="py-3">
        <CommunityPageComponent />
      </div>
    </MainLayout>
  );
}