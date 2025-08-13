import { CenteredLayout } from '@/components/layout/centeredLayout';
import { LoginPage as LoginPageComponent } from '@/features/login/components/loginPage';

export default function LoginPage() {
  return (
    <CenteredLayout showLogo={true} maxWidth="medium">
      <LoginPageComponent />
    </CenteredLayout>
  );
}