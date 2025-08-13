import { CenteredLayout } from '@/components/layout/centeredLayout';
import { SignupPage } from '@/features/signup/components/signupPage';

export default function SignupPageRoute() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <SignupPage />
    </CenteredLayout>
  );
}