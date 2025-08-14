import { MainLayout } from '@/components/layout/MainLayout';
import { WishlistPage as WishlistPageComponent } from '@/features/mypage/components/wishlistPage';
import { ProtectedRoute } from '@/features/login/hooks/useAuth';

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <WishlistPageComponent />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}