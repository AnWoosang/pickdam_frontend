import { ResponsiveLayout } from '@/shared/layout/ResponsiveLayout';
import { Mypage } from '@/domains/user/components/mypage/MypagePage';
import { ProtectedRoute } from '@/domains/auth/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <ResponsiveLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <Mypage />
        </div>
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}