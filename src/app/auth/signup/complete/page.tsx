'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignupCompletePage } from '@/domains/auth/components/signup/SignupCompletePage';

function SignupCompleteContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <SignupCompletePage email={email} />;
}

export default function SignupComplete() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupCompleteContent />
    </Suspense>
  );
}