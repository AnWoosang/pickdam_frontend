import { CenteredLayout } from '@/components/layout/CenteredLayout';
import { SignupPage } from '@/features/signup/components/SignupPage';

export default function SignupPageRoute() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <SignupPage />
    </CenteredLayout>
  );
}