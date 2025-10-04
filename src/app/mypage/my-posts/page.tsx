import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { MyPostsPage } from '@/domains/user/components/mypage/MyPostsPage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyPostsPageRoute() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MyPostsPage />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}