import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { MyCommentsPage } from '@/domains/user/components/mypage/MyCommentsPage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyCommentsPageRoute() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MyCommentsPage />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}