import { ResponsiveCenteredLayout } from '@/shared/layout/ResponsiveCenteredLayout';
import { SignupPage } from '@/domains/auth/components/signup/SignupPage';

export default function SignupPageRoute() {
  return (
    <ResponsiveCenteredLayout showLogo={true} maxWidth="medium">
      <SignupPage />
    </ResponsiveCenteredLayout>
  );
}