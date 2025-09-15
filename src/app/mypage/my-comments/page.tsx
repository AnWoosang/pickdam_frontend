import { MainLayout } from '@/shared/layout/MainLayout';
import { MyCommentsPage } from '@/domains/user/components/mypage/MyCommentsPage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyCommentsPageRoute() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MyCommentsPage />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}