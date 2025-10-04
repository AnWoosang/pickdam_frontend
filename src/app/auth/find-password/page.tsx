import { ResponsiveCenteredLayout } from '@/shared/layout/ResponsiveCenteredLayout';
import { FindPasswordPage } from '@/domains/auth/components/FindPasswordPage';

export default function FindPasswordPageRoute() {
  return (
    <ResponsiveCenteredLayout showLogo={true} maxWidth="medium">
      <FindPasswordPage />
    </ResponsiveCenteredLayout>
  );
}