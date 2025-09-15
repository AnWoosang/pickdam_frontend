import { CenteredLayout } from '@/shared/layout/CenteredLayout';
import { SignupPage } from '@/domains/auth/components/signup/SignupPage';

export default function SignupPageRoute() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <SignupPage />
    </CenteredLayout>
  );
}