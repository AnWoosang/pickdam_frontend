import { Suspense } from 'react';
import { CenteredLayout } from '@/shared/layout/CenteredLayout';
import { ResetPasswordPage } from '@/domains/auth/components/ResetPasswordPage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export default function ResetPasswordPageRoute() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <Suspense fallback={<LoadingSpinner message="페이지를 불러오는 중..." />}>
        <ResetPasswordPage />
      </Suspense>
    </CenteredLayout>
  );
}