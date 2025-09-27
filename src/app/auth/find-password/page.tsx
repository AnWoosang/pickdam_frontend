import { CenteredLayout } from '@/shared/layout/CenteredLayout';
import { FindPasswordPage } from '@/domains/auth/components/FindPasswordPage';

export default function FindPasswordPageRoute() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <FindPasswordPage />
    </CenteredLayout>
  );
}