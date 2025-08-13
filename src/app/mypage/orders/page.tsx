import { MainLayout } from '@/components/layout/mainLayout';
import { OrdersPage as OrdersPageComponent } from '@/features/mypage/components/ordersPage';
import { ProtectedRoute } from '@/features/login/hooks/useAuth';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <MainLayout showHeader={true} showFooter={true}>
        <div className="py-8">
          <OrdersPageComponent />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}