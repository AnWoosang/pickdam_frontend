import { MainLayout } from '@/components/layout/MainLayout';
import { Mypage as MypageComponent } from '@/features/mypage/components/mypage';
import { ProtectedRoute } from '@/features/login/hooks/useAuth';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <MypageComponent />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}