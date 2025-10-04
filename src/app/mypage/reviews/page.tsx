import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { MyReviewsPage } from '@/domains/user/components/mypage/MyReviewsPage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyReviewsPageRoute() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MyReviewsPage />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}