import { MainLayout } from '@/shared/layout/MainLayout';
import { Mypage } from '@/domains/user/components/mypage/MypagePage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <Mypage />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}