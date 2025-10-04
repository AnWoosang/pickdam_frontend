import { Suspense } from 'react';
import { ResponsiveCenteredLayout } from '@/shared/layout/ResponsiveCenteredLayout';
import { ResetPasswordPage } from '@/domains/auth/components/ResetPasswordPage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export default function ResetPasswordPageRoute() {
  return (
    <ResponsiveCenteredLayout showLogo={true} maxWidth="medium">
      <Suspense fallback={<LoadingSpinner message="페이지를 불러오는 중..." />}>
        <ResetPasswordPage />
      </Suspense>
    </ResponsiveCenteredLayout>
  );
}