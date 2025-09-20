'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEmailVerification } from './useSignupQueries'
import { EmailVerificationParams } from '@/domains/auth/types/auth'

export interface EmailVerificationState {
  status: 'loading' | 'success' | 'error'
  message: string
}

/**
 * 이메일 인증 처리 hook
 * URL 파라미터를 자동으로 파싱하고 인증을 처리합니다.
 */
export function useEmailVerify(): EmailVerificationState {
  const searchParams = useSearchParams()
  const emailVerification = useEmailVerification()

  const [state, setState] = useState<EmailVerificationState>({
    status: 'loading',
    message: '이메일 인증을 처리하고 있습니다...'
  })

  console.log('🔍 useEmailVerify Hook Init:', {
    searchParams: Object.fromEntries(searchParams.entries()),
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    let hasProcessed = false; // 중복 실행 방지

    async function handleEmailVerification() {
      if (hasProcessed) {
        console.log('🔍 handleEmailVerification already processed, skipping');
        return;
      }

      hasProcessed = true;
      console.log('🔍 Starting handleEmailVerification at:', new Date().toISOString());

      try {
        // URL fragment에서 토큰 정보 파싱 (Supabase implicit flow)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        // Query params에서도 확인 (PKCE flow)
        const tokenHash = searchParams.get('token_hash')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = searchParams.get('type') || hashParams.get('type') || 'signup'

        console.log('🔍 Email Verification Debug:', {
          // Query params (PKCE flow)
          tokenHash: tokenHash ? `${tokenHash.substring(0, 10)}...` : null,
          // Hash params (Implicit flow)
          accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null,
          refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
          type,
          fullUrl: window.location.href,
          allParams: Object.fromEntries(searchParams.entries()),
          hashParams: Object.fromEntries(hashParams.entries())
        });

        // Implicit flow인 경우 (access_token이 있는 경우)
        if (accessToken && refreshToken) {
          console.log('✅ Implicit flow detected - tokens found in URL fragment');

          // 로그인 완료 처리 (이미 인증됨)
          setState({
            status: 'success',
            message: '이메일 인증이 완료되었습니다!'
          })
          return;
        }

        // PKCE flow인 경우 (tokenHash가 있는 경우)
        if (!tokenHash) {
          console.log('❌ No tokenHash found in URL and no implicit flow tokens');
          throw new Error('인증 토큰이 없습니다.')
        }

        console.log('📤 PKCE flow - Calling emailVerification.mutateAsync with params:', { tokenHash: `${tokenHash.substring(0, 10)}...`, type });

        const params: EmailVerificationParams = { tokenHash, type }
        const result = await emailVerification.mutateAsync(params)

        console.log('✅ Email verification successful:', result);

        setState({
          status: 'success',
          message: '이메일 인증이 완료되었습니다!'
        })

      } catch (error) {
        console.error('❌ Email Verification Error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });

        setState({
          status: 'error',
          message: error instanceof Error ? error.message : '이메일 인증에 실패했습니다.'
        })
      }
    }

    console.log('🔍 useEffect triggered, calling handleEmailVerification');
    handleEmailVerification()
  }, [searchParams]) // emailVerification 의존성 제거

  return state
}