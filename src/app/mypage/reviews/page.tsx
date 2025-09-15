import { MainLayout } from '@/shared/layout/MainLayout';
import { MyReviewsPage } from '@/domains/user/components/mypage/MyReviewsPage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyReviewsPageRoute() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MyReviewsPage />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}