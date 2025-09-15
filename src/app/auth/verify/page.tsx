'use client';

import { Suspense } from 'react';
import { EmailVerifyPage } from '@/domains/auth/components/signup/EmailVerifyPage';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerifyPage />
    </Suspense>
  );
}